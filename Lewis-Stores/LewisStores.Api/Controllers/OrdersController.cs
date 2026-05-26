using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LewisStores.Api.Data;
using LewisStores.Api.Models;

namespace LewisStores.Api.Controllers
{
    /// <summary>
    /// Handles order retrieval and creation endpoints.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public class CreateOrderRequest
        {
            public decimal Total { get; set; }
            public string Items { get; set; } = string.Empty;
            public List<CreateOrderItem>? ItemsList { get; set; }
        }

        public class CreateOrderItem
        {
            public string ProductId { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returns all orders.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Order>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.Date)
                .ToListAsync();

            var mismatchDefectEnabled = await _context.QaFeatureFlags
                .Where(f => f.Key == "order_total_mismatch")
                .Select(f => f.IsEnabled)
                .FirstOrDefaultAsync();

            if (mismatchDefectEnabled && orders.Count > 0)
            {
                orders[0].Total += 1.11m;
            }

            return orders;
        }

        /// <summary>
        /// Creates a new order and returns the created resource.
        /// </summary>
        /// <param name="request">Order payload.</param>
        [HttpPost]
        [ProducesResponseType(typeof(Order), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            if (request.Total <= 0)
            {
                return BadRequest(new { Message = "Order total must be greater than zero." });
            }

            var order = new Order
            {
                Id = "LWS-" + Random.Shared.Next(10000, 99999),
                Date = DateTime.UtcNow.ToString("dd MMM yyyy"),
                Status = "Processing",
                UserId = userId,
                Items = request.Items
            };

            // If structured items provided, compute totals and create normalized OrderItems
            var createdOrderItems = new List<OrderItem>();
            if (request.ItemsList != null && request.ItemsList.Count > 0)
            {
                foreach (var it in request.ItemsList)
                {
                    var lineTotal = it.UnitPrice * it.Quantity;
                    createdOrderItems.Add(new OrderItem
                    {
                        ProductId = it.ProductId,
                        Quantity = it.Quantity,
                        UnitPrice = it.UnitPrice,
                        LineTotal = lineTotal,
                        OrderId = order.Id
                    });
                }

                order.Total = createdOrderItems.Sum(x => x.LineTotal);
                order.OrderItems = createdOrderItems;
            }
            else
            {
                order.Total = request.Total;
            }

            _context.Orders.Add(order);
            if (createdOrderItems.Count > 0)
            {
                _context.OrderItems.AddRange(createdOrderItems);
            }

            await _context.SaveChangesAsync();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var now = DateTime.UtcNow;
            _context.Deliveries.Add(new Delivery
            {
                OrderId = order.Id,
                UserId = userId,
                Status = "Processing",
                Carrier = "Lewis Logistics",
                TrackingNumber = $"LL-{order.Id}",
                Origin = "Johannesburg Distribution Centre",
                Destination = user?.Address?.Trim() ?? string.Empty,
                CurrentLocation = "Order received at the dispatch hub",
                ShippedAtUtc = null,
                EstimatedDeliveryAtUtc = now.AddDays(5),
                DeliveredAtUtc = null,
                UpdatedAtUtc = now
            });
            await _context.SaveChangesAsync();

            var verboseAudit = await _context.QaFeatureFlags
                .Where(f => f.Key == "audit_verbose_events")
                .Select(f => f.IsEnabled)
                .FirstOrDefaultAsync();

            if (verboseAudit)
            {
                _context.AuditLogs.Add(new AuditLog
                {
                    TimestampUtc = DateTime.UtcNow,
                    EventType = "order.created",
                    UserId = userId,
                    Severity = "Info",
                    Details = $"{{\"orderId\":\"{order.Id}\",\"total\":{order.Total}}}"
                });
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using LewisStores.Api.Models;
using System.Globalization;

namespace LewisStores.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<CartItem> CartItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<CreditApplication> CreditApplications { get; set; } = null!;
        public DbSet<PaymentMethod> PaymentMethods { get; set; } = null!;
        public DbSet<ReturnRequest> ReturnRequests { get; set; } = null!;
        public DbSet<SupportCase> SupportCases { get; set; } = null!;
        public DbSet<DefectReport> DefectReports { get; set; } = null!;
        public DbSet<MissionProgress> MissionProgresses { get; set; } = null!;
        public DbSet<QaFeatureFlag> QaFeatureFlags { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CartItem>().HasKey(c => c.InternalId);
            modelBuilder.Entity<CreditApplication>().HasKey(c => c.Id);
            modelBuilder.Entity<PaymentMethod>().HasKey(p => p.Id);
            modelBuilder.Entity<ReturnRequest>().HasKey(r => r.Id);
            modelBuilder.Entity<SupportCase>().HasKey(s => s.Id);
            modelBuilder.Entity<DefectReport>().HasKey(d => d.Id);
            modelBuilder.Entity<MissionProgress>().HasKey(m => m.Id);
            modelBuilder.Entity<QaFeatureFlag>().HasKey(f => f.Key);
            modelBuilder.Entity<AuditLog>().HasKey(a => a.Id);

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = "cat-1", Name = "Furniture", Description = "Architectural sofas, dining, and lounge essentials", To = "/products", Tone = "category-furniture" },
                new Category { Id = "cat-2", Name = "Appliances", Description = "Performance-first pieces for modern homes", To = "/products", Tone = "category-appliances" },
                new Category { Id = "cat-3", Name = "Electronics", Description = "Curated home tech and sound systems", To = "/products", Tone = "category-electronics" },
                new Category { Id = "cat-4", Name = "Decor", Description = "Lighting, art, and finishing details", To = "/products", Tone = "category-decor" },
                new Category { Id = "cat-5", Name = "Bedding", Description = "Mattresses, pillows, and linen essentials", To = "/products", Tone = "category-bedding" },
                new Category { Id = "cat-6", Name = "Office", Description = "Work-from-home desks, chairs, and accessories", To = "/products", Tone = "category-office" }
            );

            modelBuilder.Entity<Product>().HasData(BuildProductsSeed());

            modelBuilder.Entity<CartItem>().HasData(
                new CartItem { InternalId = 1, Id = "luca-modular", Title = "Luca Modular Sofa", Variant = "Pearl Cloud, Matte Black Legs", Quantity = 1, Price = 24999 },
                new CartItem { InternalId = 2, Id = "miren-table", Title = "Miren Coffee Table", Variant = "Ash + Stone", Quantity = 1, Price = 7699 }
            );

            modelBuilder.Entity<User>().HasData(BuildUsersSeed());
            modelBuilder.Entity<Order>().HasData(BuildOrdersSeed());
            modelBuilder.Entity<PaymentMethod>().HasData(BuildPaymentMethodsSeed());
            modelBuilder.Entity<ReturnRequest>().HasData(BuildReturnRequestsSeed());
            modelBuilder.Entity<SupportCase>().HasData(BuildSupportCasesSeed());
            modelBuilder.Entity<AuditLog>().HasData(BuildAuditSeed());

            modelBuilder.Entity<QaFeatureFlag>().HasData(
                new QaFeatureFlag
                {
                    Key = "product_duplicate_in_list",
                    Description = "Intentional defect: duplicate one product on catalog list responses.",
                    IsEnabled = true,
                    UpdatedAtUtc = new DateTime(2026, 4, 17, 8, 0, 0, DateTimeKind.Utc)
                },
                new QaFeatureFlag
                {
                    Key = "order_total_mismatch",
                    Description = "Intentional defect: one order total may be inconsistent with expected line-item sum.",
                    IsEnabled = true,
                    UpdatedAtUtc = new DateTime(2026, 4, 17, 8, 0, 0, DateTimeKind.Utc)
                },
                new QaFeatureFlag
                {
                    Key = "auth_email_case_sensitive",
                    Description = "Intentional defect: registration duplicate check can be case-sensitive.",
                    IsEnabled = true,
                    UpdatedAtUtc = new DateTime(2026, 4, 17, 8, 0, 0, DateTimeKind.Utc)
                },
                new QaFeatureFlag
                {
                    Key = "audit_verbose_events",
                    Description = "Enable detailed auth and order lifecycle events in audit logs.",
                    IsEnabled = true,
                    UpdatedAtUtc = new DateTime(2026, 4, 17, 8, 0, 0, DateTimeKind.Utc)
                },
                new QaFeatureFlag
                {
                    Key = "returns_refund_delay",
                    Description = "Intentional defect: approved refunds remain in pending payout state longer than expected.",
                    IsEnabled = true,
                    UpdatedAtUtc = new DateTime(2026, 4, 17, 8, 0, 0, DateTimeKind.Utc)
                },
                new QaFeatureFlag
                {
                    Key = "support_assignment_conflict",
                    Description = "Intentional defect: assignment updates may overwrite existing assignee in high-concurrency simulation.",
                    IsEnabled = true,
                    UpdatedAtUtc = new DateTime(2026, 4, 17, 8, 0, 0, DateTimeKind.Utc)
                }
            );
        }

        private static IEnumerable<Product> BuildProductsSeed()
        {
            var categories = new[] { "Furniture", "Appliances", "Electronics", "Decor", "Bedding", "Office" };
            var tags = new[] { "Best Seller", "On Sale", "New", "Limited Edition", null };
            var products = new List<Product>
            {
                new Product
                {
                    Id = "luca-modular",
                    Title = "Luca Modular Sofa",
                    Description = "Textured ivory upholstery with brushed oak legs.",
                    Price = 24999,
                    OldPrice = 27999,
                    Tag = "Limited Edition",
                    Rating = 4.8,
                    Category = "Furniture",
                    Image = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
                    Sku = "LEW-FUR-0001",
                    StockQuantity = 12,
                    IsActive = true
                },
                new Product
                {
                    Id = "atlas-lounge",
                    Title = "Atlas Lounge Chair",
                    Description = "Low-profile silhouette with layered cushioning.",
                    Price = 10999,
                    Tag = "Best Seller",
                    Rating = 4.6,
                    Category = "Furniture",
                    Image = "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&q=80&w=1200",
                    Sku = "LEW-FUR-0002",
                    StockQuantity = 9,
                    IsActive = true
                },
                new Product
                {
                    Id = "miren-table",
                    Title = "Miren Coffee Table",
                    Description = "Solid ash base and honed stone top.",
                    Price = 7699,
                    Rating = 4.7,
                    Category = "Decor",
                    Image = "https://images.unsplash.com/photo-1616627452582-9ff3d36ad306?auto=format&fit=crop&q=80&w=1200",
                    Sku = "LEW-DCR-0001",
                    StockQuantity = 5,
                    IsActive = true
                },
                new Product
                {
                    Id = "solvi-console",
                    Title = "Solvi Console",
                    Description = "Storage-forward entry piece with hidden cable tray.",
                    Price = 8999,
                    Rating = 4.5,
                    Category = "Decor",
                    Image = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200",
                    Sku = "LEW-DCR-0002",
                    StockQuantity = 6,
                    IsActive = true
                }
            };

            for (var i = 1; i <= 320; i++)
            {
                var category = categories[(i - 1) % categories.Length];
                var priceBase = 899 + ((i * 173) % 28500);
                var rating = 3.4 + ((i % 16) * 0.1);
                decimal? oldPrice = i % 3 == 0 ? priceBase + 600m : null;
                var tag = tags[i % tags.Length];
                var city = i % 2 == 0 ? "Johannesburg" : "Cape Town";
                var stock = i % 17 == 0 ? 0 : 2 + (i % 38);
                var isActive = i % 29 != 0;

                products.Add(new Product
                {
                    Id = $"p-{i:0000}",
                    Title = $"{category} Studio Series {i:000}",
                    Description = $"{category} test catalog item {i:000} prepared for Lewis QA scenarios in {city}.",
                    Price = priceBase,
                    OldPrice = oldPrice,
                    Tag = tag,
                    Rating = Math.Round(rating > 5 ? 5 : rating, 1),
                    Category = category,
                    Image = $"https://picsum.photos/seed/lewis-{i:0000}/900/600",
                    Sku = $"LEW-{category[..3].ToUpperInvariant()}-{i:0000}",
                    StockQuantity = stock,
                    IsActive = isActive
                });
            }

            return products;
        }

        private static IEnumerable<User> BuildUsersSeed()
        {
            var roles = new[] { "Customer", "Customer", "Customer", "Customer", "Customer", "SupportAgent", "Admin" };
            var users = new List<User>
            {
                // Test credentials from SETUP-GUIDE
                new User
                {
                    Id = "user-test-customer",
                    Email = "test.customer@lewisstores.local",
                    Password = "Password123!",
                    Role = "Customer",
                    FullName = "Test Customer",
                    Phone = "+27 82 555 0001",
                    Address = "123 Test Street, Johannesburg, 2000"
                },
                new User
                {
                    Id = "user-sarah-johnson",
                    Email = "sarah.johnson@lewisstores.local",
                    Password = "Password123!",
                    Role = "Customer",
                    FullName = "Sarah Johnson",
                    Phone = "+27 82 555 0002",
                    Address = "456 Main Road, Cape Town, 8000"
                },
                new User
                {
                    Id = "user-michael-chen",
                    Email = "michael.chen@lewisstores.local",
                    Password = "Password123!",
                    Role = "Customer",
                    FullName = "Michael Chen",
                    Phone = "+27 82 555 0003",
                    Address = "789 Park Avenue, Johannesburg, 2000"
                },
                new User
                {
                    Id = "user-emily-wilson",
                    Email = "emily.wilson@lewisstores.local",
                    Password = "Password123!",
                    Role = "Customer",
                    FullName = "Emily Wilson",
                    Phone = "+27 82 555 0004",
                    Address = "321 Garden Lane, Pretoria, 0001"
                },
                new User
                {
                    Id = "user-james-brown",
                    Email = "james.brown@lewisstores.local",
                    Password = "Password123!",
                    Role = "Customer",
                    FullName = "James Brown",
                    Phone = "+27 82 555 0005",
                    Address = "654 Beach Drive, Durban, 4001"
                },
                new User
                {
                    Id = "user-support-agent",
                    Email = "support.agent@lewisstores.local",
                    Password = "Password123!",
                    Role = "SupportAgent",
                    FullName = "Support Agent",
                    Phone = "+27 82 555 0006",
                    Address = "Lewis Support Centre, Johannesburg"
                },
                new User
                {
                    Id = "user-admin",
                    Email = "admin@lewisstores.local",
                    Password = "Password123!",
                    Role = "Admin",
                    FullName = "Lewis Admin",
                    Phone = "+27 82 555 0007",
                    Address = "Lewis Head Office, Johannesburg"
                }
            };

            for (var i = 2; i <= 50; i++)
            {
                var role = roles[(i - 2) % roles.Length];
                users.Add(new User
                {
                    Id = $"user-{i}",
                    Email = $"student{i:00}@lewis-training.com",
                    Password = i % 10 == 0 ? "Password123!" : "password",
                    Role = role,
                    FullName = $"Student Persona {i:00}",
                    Phone = $"+27 82 {5000 + i:0000}",
                    Address = $"{100 + i} Training Avenue, Campus {((i % 4) + 1)}, Gauteng"
                });
            }

            return users;
        }

        private static IEnumerable<Order> BuildOrdersSeed()
        {
            var statuses = new[] { "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Refunded" };
            var userIds = new[]
            {
                "user-test-customer",
                "user-sarah-johnson",
                "user-michael-chen",
                "user-emily-wilson",
                "user-james-brown",
                "user-support-agent",
                "user-admin",
                "user-2",
                "user-3",
                "user-4",
                "user-5",
                "user-6",
                "user-7",
                "user-8",
                "user-9",
                "user-10",
                "user-11",
                "user-12",
                "user-13",
                "user-14",
                "user-15",
                "user-16",
                "user-17",
                "user-18",
                "user-19",
                "user-20",
                "user-21",
                "user-22",
                "user-23",
                "user-24",
                "user-25"
            };
            var orders = new List<Order>
            {
                new Order { Id = "LWS-20419", Date = "08 Apr 2026", Status = "Delivered", Total = 11799, UserId = "user-test-customer", Items = "Samsung 65\" 4K Smart TV + LG Soundbar" },
                new Order { Id = "LWS-20388", Date = "01 Apr 2026", Status = "Shipped", Total = 24999, UserId = "user-test-customer", Items = "Luca Modular Sofa + Miren Coffee Table" },
                new Order { Id = "LWS-20293", Date = "22 Mar 2026", Status = "Processing", Total = 7699, UserId = "user-test-customer", Items = "Defy 8kg Front Loader Washing Machine" },
                new Order { Id = "LWS-20144", Date = "13 Mar 2026", Status = "Delivered", Total = 19999, UserId = "user-test-customer", Items = "Samsung 580L Double Door Fridge" }
            };

            for (var i = 20500; i <= 20749; i++)
            {
                var userIndex = (i - 20500) % userIds.Length;
                var status = statuses[(i - 20500) % statuses.Length];
                var date = DateTime.UtcNow.Date.AddDays(-((i - 20500) % 75));
                orders.Add(new Order
                {
                    Id = $"LWS-{i}",
                    Date = date.ToString("dd MMM yyyy", CultureInfo.InvariantCulture),
                    Status = status,
                    Total = 899 + ((i * 37) % 25000),
                    UserId = userIds[userIndex],
                    Items = $"Bundle {(i % 9) + 1}: Mixed home goods set"
                });
            }

            return orders;
        }

        private static IEnumerable<PaymentMethod> BuildPaymentMethodsSeed()
        {
            var methods = new List<PaymentMethod>
            {
                new PaymentMethod { Id = 1, UserId = "user-1", CardholderName = "Test Customer", Last4 = "4242", Brand = "Visa", Expiry = "12/29", IsDefault = true }
            };

            for (var i = 2; i <= 120; i++)
            {
                methods.Add(new PaymentMethod
                {
                    Id = i,
                    UserId = $"user-{((i - 2) % 49) + 2}",
                    CardholderName = $"Student Persona {((i - 2) % 49) + 2:00}",
                    Last4 = (1000 + i).ToString(),
                    Brand = i % 2 == 0 ? "Visa" : "Mastercard",
                    Expiry = $"{((i % 12) + 1):00}/{27 + (i % 4)}",
                    IsDefault = i % 5 == 0
                });
            }

            return methods;
        }

        private static IEnumerable<AuditLog> BuildAuditSeed()
        {
            var now = new DateTime(2026, 4, 17, 8, 0, 0, DateTimeKind.Utc);
            var logs = new List<AuditLog>
            {
                new AuditLog
                {
                    Id = 1,
                    TimestampUtc = now.AddMinutes(-120),
                    EventType = "qa.environment.initialized",
                    UserId = "admin-1",
                    Severity = "Info",
                    Details = "{\"dataset\":\"training-v1\",\"seedUsers\":50,\"seedProducts\":324}"
                },
                new AuditLog
                {
                    Id = 2,
                    TimestampUtc = now.AddMinutes(-90),
                    EventType = "qa.defect.flag.enabled",
                    UserId = "admin-1",
                    Severity = "Warning",
                    Details = "{\"flag\":\"order_total_mismatch\"}"
                }
            };

            for (var i = 3; i <= 300; i++)
            {
                logs.Add(new AuditLog
                {
                    Id = i,
                    TimestampUtc = now.AddMinutes(-i * 3),
                    EventType = i % 4 == 0 ? "order.status.changed" : "auth.login.success",
                    UserId = $"user-{(i % 25) + 1}",
                    Severity = i % 11 == 0 ? "Warning" : "Info",
                    Details = i % 4 == 0
                        ? $"{{\"orderId\":\"LWS-{20500 + (i % 80)}\",\"status\":\"{(i % 2 == 0 ? "Shipped" : "Delivered")}\"}}"
                        : "{\"source\":\"seeded-event\"}"
                });
            }

            return logs;
        }

        private static IEnumerable<ReturnRequest> BuildReturnRequestsSeed()
        {
            var baseTime = new DateTime(2026, 4, 12, 8, 0, 0, DateTimeKind.Utc);
            var returns = new List<ReturnRequest>
            {
                new ReturnRequest
                {
                    Id = 1,
                    OrderId = "LWS-20388",
                    UserId = "user-1",
                    Reason = "Received damaged armrest on delivery.",
                    Status = "Approved",
                    RequestedAmount = 2499,
                    ApprovedAmount = 2499,
                    ResolutionNotes = "Refund approved after photo verification.",
                    RequestedAtUtc = baseTime,
                    UpdatedAtUtc = baseTime.AddDays(2)
                },
                new ReturnRequest
                {
                    Id = 2,
                    OrderId = "LWS-20511",
                    UserId = "user-8",
                    Reason = "Item color does not match website listing.",
                    Status = "PendingReview",
                    RequestedAmount = 1299,
                    ApprovedAmount = null,
                    ResolutionNotes = "",
                    RequestedAtUtc = baseTime.AddDays(1),
                    UpdatedAtUtc = baseTime.AddDays(1)
                },
                new ReturnRequest
                {
                    Id = 3,
                    OrderId = "LWS-20547",
                    UserId = "user-18",
                    Reason = "Wrong item delivered.",
                    Status = "Rejected",
                    RequestedAmount = 1899,
                    ApprovedAmount = 0,
                    ResolutionNotes = "Courier proof indicates correct item delivered.",
                    RequestedAtUtc = baseTime.AddDays(3),
                    UpdatedAtUtc = baseTime.AddDays(5)
                }
            };

            var statuses = new[] { "PendingReview", "Approved", "Rejected", "Resolved" };
            for (var i = 4; i <= 120; i++)
            {
                returns.Add(new ReturnRequest
                {
                    Id = i,
                    OrderId = $"LWS-{20500 + (i % 250)}",
                    UserId = $"user-{((i - 1) % 49) + 2}",
                    Reason = $"Seeded return scenario {i:000}.",
                    Status = statuses[i % statuses.Length],
                    RequestedAmount = 499 + ((i * 29) % 2500),
                    ApprovedAmount = i % 3 == 0 ? 499 + ((i * 29) % 2500) : null,
                    ResolutionNotes = i % 3 == 0 ? "Seeded resolution note." : string.Empty,
                    RequestedAtUtc = baseTime.AddDays(i % 14),
                    UpdatedAtUtc = baseTime.AddDays((i % 14) + 1)
                });
            }

            return returns;
        }

        private static IEnumerable<SupportCase> BuildSupportCasesSeed()
        {
            var baseTime = new DateTime(2026, 4, 13, 10, 0, 0, DateTimeKind.Utc);
            var cases = new List<SupportCase>
            {
                new SupportCase
                {
                    Id = 1,
                    OrderId = "LWS-20388",
                    UserId = "user-1",
                    Subject = "Delivery arrived with minor damage",
                    Description = "Corner of the coffee table has a visible crack.",
                    Status = "InProgress",
                    Priority = "High",
                    AssignedToUserId = "user-4",
                    CreatedAtUtc = baseTime,
                    UpdatedAtUtc = baseTime.AddHours(4)
                },
                new SupportCase
                {
                    Id = 2,
                    OrderId = "LWS-20532",
                    UserId = "user-12",
                    Subject = "Need ETA update",
                    Description = "No delivery update for 5 days.",
                    Status = "Open",
                    Priority = "Normal",
                    AssignedToUserId = null,
                    CreatedAtUtc = baseTime.AddHours(1),
                    UpdatedAtUtc = baseTime.AddHours(1)
                },
                new SupportCase
                {
                    Id = 3,
                    OrderId = null,
                    UserId = "user-23",
                    Subject = "Profile phone number cannot be updated",
                    Description = "Field resets after save on profile page.",
                    Status = "Resolved",
                    Priority = "Normal",
                    AssignedToUserId = "admin-1",
                    CreatedAtUtc = baseTime.AddHours(2),
                    UpdatedAtUtc = baseTime.AddDays(1)
                }
            };

            var statuses = new[] { "Open", "InProgress", "WaitingOnCustomer", "Resolved", "Closed" };
            var priorities = new[] { "Low", "Normal", "High", "Urgent" };
            for (var i = 4; i <= 150; i++)
            {
                cases.Add(new SupportCase
                {
                    Id = i,
                    OrderId = i % 4 == 0 ? null : $"LWS-{20500 + (i % 250)}",
                    UserId = $"user-{((i - 1) % 49) + 2}",
                    Subject = $"Seeded support case {i:000}",
                    Description = $"Auto-generated support scenario for case {i:000}.",
                    Status = statuses[i % statuses.Length],
                    Priority = priorities[i % priorities.Length],
                    AssignedToUserId = i % 3 == 0 ? "user-support-agent" : null,
                    CreatedAtUtc = baseTime.AddHours(i),
                    UpdatedAtUtc = baseTime.AddHours(i + 2)
                });
            }

            return cases;
        }
    }
}

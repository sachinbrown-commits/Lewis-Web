using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Reflection;
using LewisStores.Api.Data;
using LewisStores.Api.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure DbContext with SQL Server
var defaultConnection = "Server=localhost;Database=LewisStoresDb;Trusted_Connection=true;Encrypt=false;";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("CONNECTION_STRINGS__DEFAULT_CONNECTION")
    ?? defaultConnection;

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlServerOptionsAction =>
    {
        sqlServerOptionsAction.MigrationsAssembly("LewisStores.Api");
    }));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Configure Mock JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "LewisStoresMockIssuer",
            ValidAudience = "LewisStoresMockAudience",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsAMockSuperSecretKeyForLewisStoresApisThatIsAtLeast32Bytes"))
        };
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Lewis Stores Commerce Platform API",
        Version = "v1.0",
        Description = """
            Enterprise API reference for the Lewis Stores digital commerce platform.

            This specification provides documentation for catalog operations, customer identity, checkout, orders, returns, support workflows, and QA training controls.

            ### Platform Capabilities
            - Product and category discovery for merchandising and storefront experiences
            - Authentication, profile management, and role-based access controls
            - Order lifecycle management, payment methods, and checkout orchestration
            - Returns/refunds and customer support case operations
            - QA scenario packs, feature flags, and audit telemetry for quality engineering exercises

            ### Security and Access
            Most customer and operational endpoints require JWT bearer authentication. Obtain an access token through `POST /api/Auth/login`, then authorize requests via the `Authorization: Bearer <token>` header.

            ### Governance Notes
            This API is intended for internal engineering, training, and controlled testing environments. Behaviour may intentionally include configurable defect scenarios for quality-engineering labs.
            """,
        TermsOfService = new Uri("https://lewisstores.local/terms/api"),
        Contact = new OpenApiContact
        {
            Name = "Lewis Stores Platform Engineering",
            Email = "platform.api@lewisstores.local",
            Url = new Uri("https://lewisstores.local/engineering")
        },
        License = new OpenApiLicense
        {
            Name = "Lewis Stores Internal Platform License",
            Url = new Uri("https://lewisstores.local/legal/internal-platform-license")
        }
    });

    c.CustomSchemaIds(type => type.FullName?.Replace("+", "."));
    c.SupportNonNullableReferenceTypes();

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
    }

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT bearer authentication.\n\nEnter only the token value below; Swagger UI will prepend 'Bearer '.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.OperationFilter<AuthorizeCheckOperationFilter>();

    c.TagActionsBy(api =>
    {
        if (api.GroupName is not null)
        {
            return new[] { api.GroupName };
        }

        if (api.ActionDescriptor.RouteValues.TryGetValue("controller", out var controllerName) && !string.IsNullOrWhiteSpace(controllerName))
        {
            return new[] { controllerName };
        }

        return new[] { "Endpoints" };
    });

    c.OrderActionsBy(api => $"{api.GroupName}_{api.HttpMethod}_{api.RelativePath}");
});

var app = builder.Build();

var resetDatabaseOnStart = builder.Configuration.GetValue<bool>("ResetDatabaseOnStart")
    || string.Equals(Environment.GetEnvironmentVariable("RESET_DATABASE_ON_START"), "true", StringComparison.OrdinalIgnoreCase);

var renderPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(renderPort))
{
    app.Urls.Add($"http://0.0.0.0:{renderPort}");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true) // Always show swagger for this mock app
{
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "docs/{documentName}/openapi.json";
    });

    app.UseStaticFiles();

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/docs/v1/openapi.json", "Lewis Stores Commerce Platform API v1.0");
        c.RoutePrefix = "docs";
        c.DocumentTitle = "Lewis Stores Commerce Platform | API Reference";
        c.DocExpansion(DocExpansion.List);
        c.DefaultModelsExpandDepth(-1);
        c.EnableDeepLinking();
        c.EnableFilter();
        c.DisplayRequestDuration();
        c.EnablePersistAuthorization();
        c.InjectStylesheet("/swagger-ui/custom.css");
        c.InjectJavascript("/swagger-ui/custom.js", "text/javascript");
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Create and initialize database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    try
    {
        if (resetDatabaseOnStart)
        {
            db.Database.EnsureDeleted();
            System.Console.WriteLine("Database deleted for reset.");
        }

        // Ensure database and schema are created
        if (!db.Database.CanConnect())
        {
            db.Database.EnsureCreated();
            System.Console.WriteLine("Database created successfully.");
        }
        else
        {
            // Database exists, ensure tables are created
            db.Database.EnsureCreated();
            System.Console.WriteLine("Database already exists. Schema verified.");
        }

        System.Console.WriteLine("Database initialization completed successfully.");
    }
    catch (Exception ex)
    {
        System.Console.WriteLine($"Error during database initialization: {ex.Message}");
        throw;
    }
}

app.Run();

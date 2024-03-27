using BackendAspNet.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

var allowAllOrigins = "AllowAllOrigins";

// Add services to the container.
var services = builder.Services;

services.AddCors(options =>
{
    options.AddPolicy(name: allowAllOrigins, policy =>
    {
        policy.WithMethods("GET", "POST", "PUT", "DELETE");
        policy.WithHeaders("*");
        policy.WithOrigins("*");
    });
});

services.AddDbContext<DocumentContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "static")),
    RequestPath = "/static"
});

app.UseCors(allowAllOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();

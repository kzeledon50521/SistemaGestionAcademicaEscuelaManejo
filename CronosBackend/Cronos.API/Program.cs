using Cronos.BLL.Services;
using Cronos.DAL.Repositories;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration
    .GetConnectionString("CronosConnection")!;

builder.Services.AddScoped<AprendizRepository>(_ =>
    new AprendizRepository(connectionString));

builder.Services.AddScoped<AprendizService>();

builder.Services.AddScoped<InstructorRepository>(_ =>
    new InstructorRepository(connectionString));

builder.Services.AddScoped<InstructorService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
using Cronos.BLL.Services;
using Cronos.DAL.Repositories;
var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration
    .GetConnectionString("CronosConnection")!;

builder.Services.AddScoped<AprendizRepository>(_ =>
    new AprendizRepository(connectionString));

builder.Services.AddScoped<AprendizService>();
builder.Services.AddScoped<InstructorRepository>(_ => new InstructorRepository(connectionString));
builder.Services.AddScoped<InstructorService>();
builder.Services.AddScoped<CursoRepository>(_ => new CursoRepository(connectionString));
builder.Services.AddScoped<CursoService>();
builder.Services.AddScoped<InscripcionRepository>(_ =>
    new InscripcionRepository(connectionString));

builder.Services.AddScoped<InscripcionService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

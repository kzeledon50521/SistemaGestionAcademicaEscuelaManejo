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

builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy => policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod());
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

app.UseHttpsRedirection();

app.UseCors("Angular");

app.UseAuthorization();

app.MapControllers();

app.Run();

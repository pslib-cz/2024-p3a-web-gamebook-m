using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Konfigurace DbContext pro použití SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Přidání Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Přidání služeb pro API
builder.Services.AddControllers();

// Přidání Swaggeru pro dokumentaci API (volitelné)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment()) {
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
} else {
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Slouží k obsluze statických souborů (např. CSS, JS)

app.UseRouting();
app.UseAuthentication(); // Nutné pro Identity
app.UseAuthorization();

// Mapování controllerů pro API
app.MapControllers();

// Nastavení fallback pro SPA nebo jiný front-end
app.MapFallbackToFile("/index.html");

// Spuštění aplikace
app.Run();

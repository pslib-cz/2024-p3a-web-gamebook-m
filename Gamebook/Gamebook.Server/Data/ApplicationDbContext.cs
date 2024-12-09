using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Models;
using Microsoft.AspNetCore.Identity;
using Gamebook.Server.Models.Gamebook.Server.Models;

namespace Gamebook.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet pro všechny entity v databázi
        public DbSet<Game> Games { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<GameState> GameStates { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Field> Fields { get; set; }
        public DbSet<Enemy> Enemies { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Základní konfigurace pro Identity
            base.OnModelCreating(builder);
        }
    }
}


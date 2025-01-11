using Gamebook.Server.Constants;
using Gamebook.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Gamebook.Server.Data {
    public class ApplicationDbContext : IdentityDbContext<User, Models.Role, string> {
        public DbSet<Models.Image> Images { get; set; } = null!;
        public override DbSet<User> Users { get; set; } = null!;
        public DbSet<GameState> GameStates { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Field> Fields { get; set; }
        public DbSet<Enemy> Enemies { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Game> Games { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            var adminRoleId = Guid.NewGuid().ToString();

            var authorRoleId = Guid.NewGuid().ToString();

        modelBuilder.Entity<Field>()
            .Property(f => f.DiceRollResults)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<Dictionary<int, string>>(v, (JsonSerializerOptions?)null)
            );
            modelBuilder.Entity<Models.Role>(options => {
                options.HasData(
                    new Models.Role {
                        Id = adminRoleId,
                        Name = Constants.Role.Admin,
                        NormalizedName = Constants.Role.Admin.ToUpper()
                    },
                    new Models.Role {
                        Id = authorRoleId,
                        Name = Constants.Role.Author,
                        NormalizedName = Constants.Role.Author.ToUpper()
                    }
                );
            });
            var mainAdminId = Guid.NewGuid().ToString();
            modelBuilder.Entity<User>(entity => {
                entity.HasMany(u => u.Roles).WithMany(r => r.Users).UsingEntity<IdentityUserRole<string>>();
                entity.HasData(
                    new User {
                        Id = mainAdminId,
                        UserName = "admin@localhost.test",
                        NormalizedUserName = "ADMIN@LOCALHOST.TEST",
                        Email = "admin@localhost.test",
                        NormalizedEmail = "ADMIN@LOCALHOST.TEST",
                        EmailConfirmed = true,
                        PasswordHash = new PasswordHasher<User>().HashPassword(null!, "admin1234"),
                        SecurityStamp = string.Empty
                    }
                );
            }
            );
            modelBuilder.Entity<IdentityUserRole<string>>(entity => {
                entity.HasKey(x => new { x.RoleId, x.UserId });
                entity.HasData(
                    new IdentityUserRole<string> {
                        RoleId = adminRoleId,
                        UserId = mainAdminId
                    },
                    new IdentityUserRole<string> {
                        RoleId = authorRoleId,
                        UserId = mainAdminId
                    }
                );
            });
        }
    }
}

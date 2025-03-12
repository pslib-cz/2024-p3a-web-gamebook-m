using Gamebook.Server.Constants;
using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class EnemiesController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public EnemiesController(ApplicationDbContext context) {
            _context = context;
        }

        // GET /api/enemies
        [HttpGet]
        public async Task<ActionResult<ListResult<EnemyListVM>>> GetEnemies([FromQuery] int? page = 0, [FromQuery] int? size = 10) {
            var query = _context.Enemies.AsQueryable();

            var total = await query.CountAsync();
            var enemies = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(e => new EnemyListVM {
                    Id = e.EnemyId,
                    Name = e.Name,
                    Strength = e.Strength,
                    Will = e.Will
                })
                .ToListAsync();

            return Ok(new ListResult<EnemyListVM> {
                Total = total,
                Items = enemies,
                Count = enemies.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // GET /api/enemies/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEnemyById(int id) {
            var enemy = await _context.Enemies.FirstOrDefaultAsync(e => e.EnemyId == id);

            if (enemy == null) {
                return NotFound();
            }

            return Ok(new EnemyDetailVM {
                Id = enemy.EnemyId,
                Name = enemy.Name,
                Description = enemy.Description,
                Strength = enemy.Strength,
                Will = enemy.Will
            });
        }

        // POST /api/enemies
        [HttpPost]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> CreateEnemy([FromBody] EnemyCreateVM enemyVm) {
            var enemy = new Enemy {
                Name = enemyVm.Name,
                Description = enemyVm.Description,
                Strength = enemyVm.Strength,
                Will = enemyVm.Will
            };

            _context.Enemies.Add(enemy);
            await _context.SaveChangesAsync();

            return Ok(enemy);
        }

        // PUT /api/enemies/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> UpdateEnemy(int id, [FromBody] EnemyCreateVM enemyVm) {
            var enemy = await _context.Enemies.FindAsync(id);
            if (enemy == null) {
                return NotFound();
            }

            enemy.Name = enemyVm.Name;
            enemy.Description = enemyVm.Description;
            enemy.Strength = enemyVm.Strength;
            enemy.Will = enemyVm.Will;

            _context.Enemies.Update(enemy);
            await _context.SaveChangesAsync();

            return Ok(enemy);
        }

        // DELETE /api/enemies/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> DeleteEnemy(int id) {
            var enemy = await _context.Enemies.FindAsync(id);
            if (enemy == null) {
                return NotFound();
            }

            _context.Enemies.Remove(enemy);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

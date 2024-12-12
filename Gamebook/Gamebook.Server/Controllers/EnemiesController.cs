using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
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

        [HttpGet]
        public async Task<ActionResult<ListResult<EnemyListVM>>> GetEnemies(string? name, int? page = null, int? size = null) {
            var query = _context.Enemies.Include(x => x.RewardCard).AsQueryable();

            if (!string.IsNullOrWhiteSpace(name)) {
                query = query.Where(e => e.Name.Contains(name));
            }

            var total = await query.CountAsync();
            var enemies = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(e => new EnemyListVM {
                    Id = e.EnemyId,
                    Name = e.Name,
                    RewardCardId = e.RewardCardId
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

        [HttpPost]
        public async Task<IActionResult> CreateEnemy([FromBody] EnemyVM enemyVm) {
            var enemy = new Enemy {
                Name = enemyVm.Name,
                Strength = enemyVm.Strength,
                Will = enemyVm.Will,
                RewardCardId = enemyVm.RewardCardId
            };

            _context.Enemies.Add(enemy);
            await _context.SaveChangesAsync();

            return Ok(enemy);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEnemyById(int id) {
            var enemy = await _context.Enemies
                .Include(e => e.RewardCard)
                .FirstOrDefaultAsync(e => e.EnemyId == id);

            if (enemy == null) {
                return NotFound();
            }

            return Ok(enemy);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEnemy(int id, [FromBody] EnemyVM enemyVm) {
            var enemy = await _context.Enemies.FindAsync(id);
            if (enemy == null) {
                return NotFound();
            }

            enemy.Name = enemyVm.Name;
            enemy.Strength = enemyVm.Strength;
            enemy.Will = enemyVm.Will;
            enemy.RewardCardId = enemyVm.RewardCardId;

            _context.Enemies.Update(enemy);
            await _context.SaveChangesAsync();

            return Ok(enemy);
        }

        [HttpDelete("{id}")]
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

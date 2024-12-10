using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Data;
using Gamebook.Server.Models;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnemiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnemiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Enemies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enemy>>> GetEnemies()
        {
            return await _context.Enemies.ToListAsync();
        }

        // GET: api/Enemies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Enemy>> GetEnemy(int id)
        {
            var enemy = await _context.Enemies.FindAsync(id);

            if (enemy == null)
            {
                return NotFound();
            }

            return enemy;
        }

        // PUT: api/Enemies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEnemy(int id, Enemy enemy)
        {
            if (id != enemy.EnemyId)
            {
                return BadRequest();
            }

            _context.Entry(enemy).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EnemyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Enemies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Enemy>> PostEnemy(Enemy enemy)
        {
            _context.Enemies.Add(enemy);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEnemy", new { id = enemy.EnemyId }, enemy);
        }

        // DELETE: api/Enemies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnemy(int id)
        {
            var enemy = await _context.Enemies.FindAsync(id);
            if (enemy == null)
            {
                return NotFound();
            }

            _context.Enemies.Remove(enemy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnemyExists(int id)
        {
            return _context.Enemies.Any(e => e.EnemyId == id);
        }
    }
}

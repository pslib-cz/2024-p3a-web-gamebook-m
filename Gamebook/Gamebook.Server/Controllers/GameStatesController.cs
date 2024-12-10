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
    public class GameStatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GameStatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/GameStates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameState>>> GetGameStates()
        {
            return await _context.GameStates.ToListAsync();
        }

        // GET: api/GameStates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameState>> GetGameState(int id)
        {
            var gameState = await _context.GameStates.FindAsync(id);

            if (gameState == null)
            {
                return NotFound();
            }

            return gameState;
        }

        // PUT: api/GameStates/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGameState(int id, GameState gameState)
        {
            if (id != gameState.GameStateId)
            {
                return BadRequest();
            }

            _context.Entry(gameState).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameStateExists(id))
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

        // POST: api/GameStates
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GameState>> PostGameState(GameState gameState)
        {
            _context.GameStates.Add(gameState);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGameState", new { id = gameState.GameStateId }, gameState);
        }

        // DELETE: api/GameStates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameState(int id)
        {
            var gameState = await _context.GameStates.FindAsync(id);
            if (gameState == null)
            {
                return NotFound();
            }

            _context.GameStates.Remove(gameState);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameStateExists(int id)
        {
            return _context.GameStates.Any(e => e.GameStateId == id);
        }
    }
}

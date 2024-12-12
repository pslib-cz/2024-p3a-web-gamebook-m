using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class GameStatesController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public GameStatesController(ApplicationDbContext context) {
            _context = context;
        }

        // GET: api/gamestates
        [HttpGet]
        public async Task<ActionResult<ListResult<GameStateVM>>> GetGameStates(int? page = null, int? size = null) {
            var query = _context.GameStates
                .Include(g => g.Inventory)
                .Include(g => g.Character)
                .Include(g => g.ActualField)
                .AsQueryable();

            var total = await query.CountAsync();
            var gameStates = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(g => new GameStateVM {
                    GameStateId = g.GameStateId,
                    InventoryId = g.InventoryId,
                    CharacterId = g.CharacterId,
                    ActualFieldId = g.ActualFieldId
                })
                .ToListAsync();

            return Ok(new ListResult<GameStateVM> {
                Total = total,
                Items = gameStates,
                Count = gameStates.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // GET: api/gamestates/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameStateById(int id) {
            var gameState = await _context.GameStates
                .Include(g => g.Inventory)
                .Include(g => g.Character)
                .Include(g => g.ActualField)
                .FirstOrDefaultAsync(g => g.GameStateId == id);

            if (gameState == null) {
                return NotFound();
            }

            var gameStateVm = new GameStateVM {
                GameStateId = gameState.GameStateId,
                InventoryId = gameState.InventoryId,
                CharacterId = gameState.CharacterId,
                ActualFieldId = gameState.ActualFieldId
            };

            return Ok(gameStateVm);
        }

        // POST: api/gamestates
        [HttpPost]
        public async Task<IActionResult> CreateGameState([FromBody] GameStateVM gameStateVm) {
            if (gameStateVm == null) {
                return BadRequest("GameState data is invalid.");
            }

            var gameState = new GameState {
                InventoryId = gameStateVm.InventoryId,
                CharacterId = gameStateVm.CharacterId,
                ActualFieldId = gameStateVm.ActualFieldId
            };

            _context.GameStates.Add(gameState);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGameStateById), new { id = gameState.GameStateId }, gameState);
        }

        // PUT: api/gamestates/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGameState(int id, [FromBody] GameStateVM gameStateVm) {
            var gameState = await _context.GameStates.FindAsync(id);
            if (gameState == null) {
                return NotFound();
            }

            gameState.InventoryId = gameStateVm.InventoryId;
            gameState.CharacterId = gameStateVm.CharacterId;
            gameState.ActualFieldId = gameStateVm.ActualFieldId;

            _context.GameStates.Update(gameState);
            await _context.SaveChangesAsync();

            return Ok(gameState);
        }

        // DELETE: api/gamestates/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameState(int id) {
            var gameState = await _context.GameStates.FindAsync(id);
            if (gameState == null) {
                return NotFound();
            }

            _context.GameStates.Remove(gameState);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

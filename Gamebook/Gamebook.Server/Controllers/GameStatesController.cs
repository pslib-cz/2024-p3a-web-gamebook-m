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
    public class GameStatesController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public GameStatesController(ApplicationDbContext context) {
            _context = context;
        }

        // GET /api/gamestates
        [HttpGet]
        public async Task<ActionResult<ListResult<GameStateListVM>>> GetGameStates([FromQuery] int? page = 0, [FromQuery] int? size = 10) {
            var query = _context.GameStates.Include(g => g.Inventory).Include(g => g.Character).Include(g => g.ActualField).AsQueryable();

            var total = await query.CountAsync();
            var gameStates = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(gs => new GameStateListVM {
                    Id = gs.GameStateId,
                    InventoryId = gs.InventoryId,
                    CharacterId = gs.CharacterId,
                    ActualFieldId = gs.ActualFieldId
                })
                .ToListAsync();

            return Ok(new ListResult<GameStateListVM> {
                Total = total,
                Items = gameStates,
                Count = gameStates.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // GET /api/gamestates/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameStateById(int id) {
            var gameState = await _context.GameStates
                .Include(gs => gs.Inventory)
                .Include(gs => gs.Character)
                .Include(gs => gs.ActualField)
                .FirstOrDefaultAsync(gs => gs.GameStateId == id);

            if (gameState == null) {
                return NotFound();
            }

            return Ok(new GameStateDetailVM {
                Id = gameState.GameStateId,
                InventoryId = gameState.InventoryId,
                CharacterId = gameState.CharacterId,
                ActualFieldId = gameState.ActualFieldId
            });
        }

        // POST /api/gamestates
        [HttpPost]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> CreateGameState([FromBody] GameStateCreateVM gameStateVm) {
            var inventory = await _context.Inventories.FindAsync(gameStateVm.InventoryId);
            var character = await _context.Characters.FindAsync(gameStateVm.CharacterId);
            var actualField = await _context.Fields.FindAsync(gameStateVm.ActualFieldId);

            if (inventory == null || character == null || actualField == null) {
                return BadRequest("Invalid InventoryId, CharacterId, or ActualFieldId provided.");
            }

            var gameState = new GameState {
                InventoryId = gameStateVm.InventoryId,
                CharacterId = gameStateVm.CharacterId,
                ActualFieldId = gameStateVm.ActualFieldId
            };

            _context.GameStates.Add(gameState);
            await _context.SaveChangesAsync();

            return Ok(gameState);
        }

        // PUT /api/gamestates/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> UpdateGameState(int id, [FromBody] GameStateCreateVM gameStateVm) {
            var gameState = await _context.GameStates.FindAsync(id);
            if (gameState == null) {
                return NotFound();
            }

            var inventory = await _context.Inventories.FindAsync(gameStateVm.InventoryId);
            var character = await _context.Characters.FindAsync(gameStateVm.CharacterId);
            var actualField = await _context.Fields.FindAsync(gameStateVm.ActualFieldId);

            if (inventory == null || character == null || actualField == null) {
                return BadRequest("Invalid InventoryId, CharacterId, or ActualFieldId provided.");
            }

            gameState.InventoryId = gameStateVm.InventoryId;
            gameState.CharacterId = gameStateVm.CharacterId;
            gameState.ActualFieldId = gameStateVm.ActualFieldId;

            _context.GameStates.Update(gameState);
            await _context.SaveChangesAsync();

            return Ok(gameState);
        }

        // DELETE /api/gamestates/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Admin)]
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

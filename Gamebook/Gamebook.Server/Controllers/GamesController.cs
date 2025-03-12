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
    public class GamesController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public GamesController(ApplicationDbContext context) {
            _context = context;
        }

        // GET /api/games
        [HttpGet]
        public async Task<ActionResult<ListResult<GameListVM>>> GetGames([FromQuery] int? page = 0, [FromQuery] int? size = 10) {
            var query = _context.Games.Include(g => g.User).Include(g => g.GameState).AsQueryable();

            var total = await query.CountAsync();
            var games = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(g => new GameListVM {
                    Id = g.GameId,
                    UserId = g.UserId,
                    GameStateId = g.GameStateId
                })
                .ToListAsync();

            return Ok(new ListResult<GameListVM> {
                Total = total,
                Items = games,
                Count = games.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // GET /api/games/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameById(int id) {
            var game = await _context.Games
                .Include(g => g.User)
                .Include(g => g.GameState)
                .FirstOrDefaultAsync(g => g.GameId == id);

            if (game == null) {
                return NotFound();
            }

            return Ok(new GameDetailVM {
                Id = game.GameId,
                UserId = game.UserId,
                GameStateId = game.GameStateId
            });
        }

        // POST /api/games
        [HttpPost]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> CreateGame([FromBody] GameCreateVM gameVm) {
            var user = await _context.Users.FindAsync(gameVm.UserId);
            var gameState = await _context.GameStates.FindAsync(gameVm.GameStateId);

            if (user == null || gameState == null) {
                return BadRequest("Invalid UserId or GameStateId provided.");
            }

            var game = new Game {
                UserId = gameVm.UserId,
                GameStateId = gameVm.GameStateId
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return Ok(game);
        }

        // PUT /api/games/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> UpdateGame(int id, [FromBody] GameCreateVM gameVm) {
            var game = await _context.Games.FindAsync(id);
            if (game == null) {
                return NotFound();
            }

            var user = await _context.Users.FindAsync(gameVm.UserId);
            var gameState = await _context.GameStates.FindAsync(gameVm.GameStateId);

            if (user == null || gameState == null) {
                return BadRequest("Invalid UserId or GameStateId provided.");
            }

            game.UserId = gameVm.UserId;
            game.GameStateId = gameVm.GameStateId;

            _context.Games.Update(game);
            await _context.SaveChangesAsync();

            return Ok(game);
        }

        // DELETE /api/games/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> DeleteGame(int id) {
            var game = await _context.Games.FindAsync(id);
            if (game == null) {
                return NotFound();
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

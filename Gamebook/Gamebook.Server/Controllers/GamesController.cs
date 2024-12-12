using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
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

        // GET: api/games
        [HttpGet]
        public async Task<ActionResult<ListResult<GameVM>>> GetGames(string? userId, int? page = null, int? size = null) {
            var query = _context.Games.Include(g => g.User).Include(g => g.GameState).AsQueryable();

            if (!string.IsNullOrWhiteSpace(userId)) {
                query = query.Where(g => g.UserId.Contains(userId));
            }

            var total = await query.CountAsync();
            var games = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(g => new GameVM {
                    GameId = g.GameId,
                    UserId = g.UserId,
                    GameStateId = g.GameStateId,
                    UserName = g.User.UserName, // Assuming User has a property 'UserName'
                    GameStateName = g.GameState != null ? g.GameState.ToString() : "Unknown" // Replace with actual GameState field
                })
                .ToListAsync();

            return Ok(new ListResult<GameVM> {
                Total = total,
                Items = games,
                Count = games.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // GET: api/games/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameById(int id) {
            var game = await _context.Games
                .Include(g => g.User)
                .Include(g => g.GameState)
                .FirstOrDefaultAsync(g => g.GameId == id);

            if (game == null) {
                return NotFound();
            }

            var gameVm = new GameVM {
                GameId = game.GameId,
                UserId = game.UserId,
                GameStateId = game.GameStateId,
                UserName = game.User.UserName, // Assuming User has a 'UserName'
                GameStateName = game.GameState != null ? game.GameState.ToString() : "Unknown"
            };

            return Ok(gameVm);
        }

        // POST: api/games
        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody] GameVM gameVm) {
            if (gameVm == null) {
                return BadRequest("Game data is invalid.");
            }

            var game = new Game {
                UserId = gameVm.UserId,
                GameStateId = gameVm.GameStateId
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGameById), new { id = game.GameId }, game);
        }

        // PUT: api/games/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGame(int id, [FromBody] GameVM gameVm) {
            var game = await _context.Games.FindAsync(id);
            if (game == null) {
                return NotFound();
            }

            game.UserId = gameVm.UserId;
            game.GameStateId = gameVm.GameStateId;

            _context.Games.Update(game);
            await _context.SaveChangesAsync();

            return Ok(game);
        }

        // DELETE: api/games/{id}
        [HttpDelete("{id}")]
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

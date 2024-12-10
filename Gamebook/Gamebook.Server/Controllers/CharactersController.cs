using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Data; // Namespace pro DbContext
using Gamebook.Server.Models; // Namespace pro modely

namespace Gamebook.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public CharactersController(ApplicationDbContext context) {
            _context = context;
        }

        // GET: api/Characters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Character>>> GetCharacters() {
            return await _context.Characters.Include(c => c.Image).ToListAsync();
        }

        // GET: api/Characters/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Character>> GetCharacter(int id) {
            var character = await _context.Characters
                .Include(c => c.Image)
                .Include(c => c.StartingField)
                .FirstOrDefaultAsync(c => c.CharacterId == id);

            if (character == null) {
                return NotFound();
            }

            return character;
        }

        // POST: api/Characters
        [HttpPost]
        public async Task<ActionResult<Character>> CreateCharacter(Character character) {
            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCharacter), new { id = character.CharacterId }, character);
        }

        // PUT: api/Characters/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCharacter(int id, Character character) {
            if (id != character.CharacterId) {
                return BadRequest();
            }

            _context.Entry(character).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!CharacterExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Characters/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCharacter(int id) {
            var character = await _context.Characters.FindAsync(id);
            if (character == null) {
                return NotFound();
            }

            _context.Characters.Remove(character);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CharacterExists(int id) {
            return _context.Characters.Any(c => c.CharacterId == id);
        }
    }
}

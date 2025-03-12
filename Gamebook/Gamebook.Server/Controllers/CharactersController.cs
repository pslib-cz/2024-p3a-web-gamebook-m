using Gamebook.Server.Constants;
using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CharactersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/characters
        [HttpGet]
        public async Task<ActionResult<ListResult<CharacterListVM>>> GetCharacters([FromQuery] int? page = 0, [FromQuery] int? size = 10)
        {
            var query = _context.Characters.Include(c => c.StartingField).Include(c => c.Image).AsQueryable();

            var total = await query.CountAsync();
            var characters = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(c => new CharacterListVM
                {
                    Id = c.CharacterId,
                    Name = c.Name,
                    Class = c.Class,
                    StartingFieldId = c.StartingFieldId,
                    ImageId = c.ImageId
                })
                .ToListAsync();

            return Ok(new ListResult<CharacterListVM>
            {
                Total = total,
                Items = characters,
                Count = characters.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // GET /api/characters/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCharacterById(int id)
        {
            var character = await _context.Characters
                .Include(c => c.StartingField)
                .Include(c => c.Image)
                .FirstOrDefaultAsync(c => c.CharacterId == id);

            if (character == null)
            {
                return NotFound();
            }

            return Ok(new CharacterDetailVM
            {
                Id = character.CharacterId,
                Name = character.Name,
                Class = character.Class,
                Strength = character.Strength,
                Will = character.Will,
                PointsOfDestiny = character.PointsOfDestiny,
                Backstory = character.Backstory,    // Přidání Backstory
                Ability = character.Ability,        // Přidání Ability
                MaxHP = character.MaxHP,
                MaxDificulty = character.MaxDificulty,
                StartingFieldId = character.StartingFieldId,
                ImageId = character.ImageId
            });
        }

        // POST /api/characters
        [HttpPost]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> CreateCharacter([FromBody] CharacterCreateVM characterVm)
        {
            var startingField = await _context.Fields.FindAsync(characterVm.StartingFieldId);
            var image = await _context.Images.FindAsync(characterVm.ImageId);

            if (startingField == null || (characterVm.ImageId.HasValue && image == null))
            {
                return BadRequest("Invalid StartingFieldId or ImageId provided.");
            }

            var character = new Character
            {
                Name = characterVm.Name,
                Class = characterVm.Class,
                Strength = characterVm.Strength,
                Will = characterVm.Will,
                PointsOfDestiny = characterVm.PointsOfDestiny,
                Backstory = characterVm.Backstory,  // Přidání Backstory
                Ability = characterVm.Ability,      // Přidání Ability
                MaxHP = characterVm.MaxHP,
                MaxDificulty = characterVm.MaxDificulty,
                StartingFieldId = characterVm.StartingFieldId,
                ImageId = characterVm.ImageId
            };

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            return Ok(character);
        }

        // PUT /api/characters/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> UpdateCharacter(int id, [FromBody] CharacterCreateVM characterVm)
        {
            var character = await _context.Characters.FindAsync(id);
            if (character == null)
            {
                return NotFound();
            }

            var startingField = await _context.Fields.FindAsync(characterVm.StartingFieldId);
            var image = await _context.Images.FindAsync(characterVm.ImageId);

            if (startingField == null || (characterVm.ImageId.HasValue && image == null))
            {
                return BadRequest("Invalid StartingFieldId or ImageId provided.");
            }

            character.Name = characterVm.Name;
            character.Class = characterVm.Class;
            character.Strength = characterVm.Strength;
            character.Will = characterVm.Will;
            character.PointsOfDestiny = characterVm.PointsOfDestiny;
            character.Backstory = characterVm.Backstory;  // Aktualizace Backstory
            character.Ability = characterVm.Ability;      // Aktualizace Ability
            character.MaxHP = characterVm.MaxHP;
            character.MaxDificulty = characterVm.MaxDificulty;
            character.StartingFieldId = characterVm.StartingFieldId;
            character.ImageId = characterVm.ImageId;

            _context.Characters.Update(character);
            await _context.SaveChangesAsync();

            return Ok(character);
        }

        // DELETE /api/characters/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> DeleteCharacter(int id)
        {
            var character = await _context.Characters.FindAsync(id);
            if (character == null)
            {
                return NotFound();
            }

            _context.Characters.Remove(character);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

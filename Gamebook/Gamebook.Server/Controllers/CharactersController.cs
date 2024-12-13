using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public CharactersController(ApplicationDbContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ListResult<CharacterListVM>>> GetCharacters(string? name, int? page = null, int? size = null) {
            var query = _context.Characters.Include(x => x.StartingField).Include(x => x.Image).AsQueryable();

            if (!string.IsNullOrWhiteSpace(name)) {
                query = query.Where(c => c.Name.Contains(name));
            }

            var total = await query.CountAsync();
            var characters = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(c => new CharacterListVM {
                    Id = c.CharacterId,
                    Name = c.Name,
                    StartingFieldId = c.StartingFieldId, 
                    ImageId = c.ImageId 
                })
                .ToListAsync();

            return Ok(new ListResult<CharacterListVM> {
                Total = total,
                Items = characters,
                Count = characters.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCharacter([FromBody] CharacterVM characterVm) {
            // Fetch the StartingField based on the provided ID
            var startingField = await _context.Fields.FindAsync(characterVm.StartingFieldId);
            if (startingField == null) {
                return BadRequest("Invalid StartingFieldId provided.");
            }

            // Fetch the Image based on the provided ID
            Image image = null;
            if (characterVm.ImageId.HasValue) {
                image = await _context.Images.FindAsync(characterVm.ImageId.Value);
                if (image == null) {
                    return BadRequest("Invalid ImageId provided.");
                }
            }

            // Create the new character
            var character = new Character {
                Name = characterVm.Name,
                Class = characterVm.Class,
                Strength = characterVm.Strength,
                Will = characterVm.Will,
                PointsOfDestiny = characterVm.PointsOfDestiny,
                Backstory = characterVm.Backstory,
                Ability = characterVm.Ability,
                MaxHP = characterVm.MaxHP,
                MaxDificulty = characterVm.MaxDificulty,
                StartingField = startingField, // Assign the field
                Image = image // Assign the image (if any)
            };

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCharacterById), new { id = character.CharacterId }, character);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCharacterById(int id) {
            var character = await _context.Characters
                .Include(c => c.StartingField)
                .Include(c => c.Image)
                .FirstOrDefaultAsync(c => c.CharacterId == id);

            if (character == null) {
                return NotFound();
            }

            return Ok(character);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCharacter(int id, [FromBody] CharacterVM characterVm) {
            var character = await _context.Characters.FindAsync(id);
            if (character == null) {
                return NotFound();
            }

            character.Name = characterVm.Name;
            character.Class = characterVm.Class;
            character.Strength = characterVm.Strength;
            character.Will = characterVm.Will;
            character.PointsOfDestiny = characterVm.PointsOfDestiny;
            character.Backstory = characterVm.Backstory;
            character.Ability = characterVm.Ability;
            character.MaxHP = characterVm.MaxHP;
            character.MaxDificulty = characterVm.MaxDificulty;
            character.StartingFieldId = characterVm.StartingFieldId;
            character.ImageId = characterVm.ImageId; 

            _context.Characters.Update(character);
            await _context.SaveChangesAsync();

            return Ok(character);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCharacter(int id) {
            var character = await _context.Characters.FindAsync(id);
            if (character == null) {
                return NotFound();
            }

            _context.Characters.Remove(character);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}


using Gamebook.Server.Constants;
using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FieldsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FieldsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/fields/{id}/imageid
        [HttpGet("{id}/imageid")]
        public async Task<IActionResult> GetFieldImageId(int id)
        {
            var field = await _context.Fields.FirstOrDefaultAsync(f => f.FieldId == id);

            if (field == null)
            {
                return NotFound();
            }
            return Ok(new { imageId = field.ImageId });
        }


        [HttpGet]
        public async Task<ActionResult<ListResult<FieldListVM>>> GetFields(string? title, int? page = null, int? size = null)
        {
            var query = _context.Fields.Include(f => f.Image).Include(f => f.Card).AsQueryable();

            if (!string.IsNullOrWhiteSpace(title))
            {
                query = query.Where(f => f.Title.Contains(title));
            }

            var total = await query.CountAsync();
            var fields = await query
                .Skip((page ?? 0) * (size ?? 100))
                .Take(size ?? 100)
                .Select(f => new FieldListVM
                {
                    FieldId = f.FieldId,
                    Title = f.Title,
                    Difficulty = f.Difficulty,
                    EnemyId = f.CardId,
                    ImageId = f.ImageId
                })
                .ToListAsync();

            return Ok(new ListResult<FieldListVM>
            {
                Total = total,
                Items = fields,
                Count = fields.Count,
                Page = page ?? 0,
                Size = size ?? 100
            });
        }

        [HttpPost]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> CreateField([FromBody] FieldVM fieldVm)
        {
            Image image = null;
            if (fieldVm.ImageId.HasValue)
            {
                image = await _context.Images.FindAsync(fieldVm.ImageId.Value);
                if (image == null)
                {
                    return BadRequest("Invalid ImageId provided.");
                }
            }

            // Fetch the Enemy if EnemyId is provided
            Enemy enemy = null;
            if (fieldVm.CardId.HasValue)
            {
                enemy = await _context.Enemies.FindAsync(fieldVm.CardId.Value);
                if (enemy == null)
                {
                    return BadRequest("Invalid EnemyId provided.");
                }
            }

            // Create the new field
            var field = new Field
            {
                Title = fieldVm.Title,
                Description = fieldVm.Description,
                Difficulty = fieldVm.Difficulty,
                numOfCards = fieldVm.numOfCards,
                DiceRollResults = fieldVm.DiceRollResults,
                ImageId = image?.ImageId,
                CardId = enemy?.EnemyId
            };

            _context.Fields.Add(field);
            await _context.SaveChangesAsync();

            return Ok(field);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFieldById(int id)
        {
            var field = await _context.Fields
                .Include(f => f.Image)
                .Include(f => f.Card)
                .FirstOrDefaultAsync(f => f.FieldId == id);

            if (field == null)
            {
                return NotFound();
            }

            return Ok(field);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> UpdateField(int id, [FromBody] FieldVM fieldVm)
        {
            var field = await _context.Fields.FindAsync(id);
            if (field == null)
            {
                return NotFound();
            }

            field.Title = fieldVm.Title;
            field.Description = fieldVm.Description;
            field.Difficulty = fieldVm.Difficulty;
            field.numOfCards = fieldVm.numOfCards;
            field.DiceRollResults = fieldVm.DiceRollResults; // Updating DiceRollResults
            field.ImageId = fieldVm.ImageId;
            field.CardId = fieldVm.CardId;

            _context.Fields.Update(field);
            await _context.SaveChangesAsync();

            return Ok(field);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> DeleteField(int id)
        {
            var field = await _context.Fields.FindAsync(id);
            if (field == null)
            {
                return NotFound();
            }

            _context.Fields.Remove(field);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
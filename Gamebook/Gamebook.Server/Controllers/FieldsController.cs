using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FieldsController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public FieldsController(ApplicationDbContext context) {
            _context = context;
        }

        // GET: api/Fields
        [HttpGet]
        public async Task<ActionResult<ListResult<FieldListVM>>> GetFields(string? title, int? page = null, int? size = null) {
            var query = _context.Fields.Include(f => f.Image).Include(f => f.Enemy).AsQueryable();

            if (!string.IsNullOrWhiteSpace(title)) {
                query = query.Where(f => f.Title.Contains(title));
            }

            var total = await query.CountAsync();
            var fields = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(f => new FieldListVM {
                    Id = f.FieldId,
                    Title = f.Title,
                    Difficulty = f.Difficulty,
                    ImageId = f.ImageId,
                    EnemyId = f.EnemyId
                })
                .ToListAsync();

            return Ok(new ListResult<FieldListVM> {
                Total = total,
                Items = fields,
                Count = fields.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // POST: api/Fields
        [HttpPost]
        public async Task<IActionResult> CreateField([FromBody] FieldVM fieldVm) {
            var field = new Field {
                Title = fieldVm.Title,
                Description = fieldVm.Description,
                Difficulty = fieldVm.Difficulty,
                numOfCards = fieldVm.numOfCards,
                DiceRoll1Result = fieldVm.DiceRoll1Result,
                DiceRoll2Result = fieldVm.DiceRoll2Result,
                DiceRoll3Result = fieldVm.DiceRoll3Result,
                DiceRoll4Result = fieldVm.DiceRoll4Result,
                DiceRoll5Result = fieldVm.DiceRoll5Result,
                DiceRoll6Result = fieldVm.DiceRoll6Result,
                EnemyId = fieldVm.EnemyId,
                ImageId = fieldVm.ImageId
            };

            _context.Fields.Add(field);
            await _context.SaveChangesAsync();

            return Ok(field);
        }

        // GET: api/Fields/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFieldById(int id) {
            var field = await _context.Fields
                .Include(f => f.Image)
                .Include(f => f.Enemy)
                .Include(f => f.Cards) // If you want to include the associated cards
                .FirstOrDefaultAsync(f => f.FieldId == id);

            if (field == null) {
                return NotFound();
            }

            return Ok(field);
        }

        // PUT: api/Fields/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateField(int id, [FromBody] FieldVM fieldVm) {
            var field = await _context.Fields.FindAsync(id);
            if (field == null) {
                return NotFound();
            }

            field.Title = fieldVm.Title;
            field.Description = fieldVm.Description;
            field.Difficulty = fieldVm.Difficulty;
            field.numOfCards = fieldVm.numOfCards;
            field.DiceRoll1Result = fieldVm.DiceRoll1Result;
            field.DiceRoll2Result = fieldVm.DiceRoll2Result;
            field.DiceRoll3Result = fieldVm.DiceRoll3Result;
            field.DiceRoll4Result = fieldVm.DiceRoll4Result;
            field.DiceRoll5Result = fieldVm.DiceRoll5Result;
            field.DiceRoll6Result = fieldVm.DiceRoll6Result;
            field.EnemyId = fieldVm.EnemyId;
            field.ImageId = fieldVm.ImageId;

            _context.Fields.Update(field);
            await _context.SaveChangesAsync();

            return Ok(field);
        }

        // DELETE: api/Fields/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteField(int id) {
            var field = await _context.Fields.FindAsync(id);
            if (field == null) {
                return NotFound();
            }

            _context.Fields.Remove(field);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase {
        private readonly ApplicationDbContext _context;

        // Constructor that initializes the _context field
        public CardsController(ApplicationDbContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ListResult<CardListVM>>> GetCards(string? title, int? page = null, int? size = null) {
            var query = _context.Cards.Include(c => c.Image).Include(c => c.Enemy).AsQueryable();

            if (!string.IsNullOrWhiteSpace(title)) {
                query = query.Where(c => c.Title.Contains(title));
            }

            var total = await query.CountAsync();
            var cards = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(c => new CardListVM {
                    Id = c.CardId,
                    Title = c.Title,
                    EnemyId = c.EnemyId,
                    ImageId = c.ImageId
                })
                .ToListAsync();

            return Ok(new ListResult<CardListVM> {
                Total = total,
                Items = cards,
                Count = cards.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCard([FromBody] CardVM cardVm) {
            var card = new Card {
                Title = cardVm.Title,
                Description = cardVm.Description,
                SpecialAbilities = cardVm.SpecialAbilities,
                DiceRoll1Result = cardVm.DiceRoll1Result,
                DiceRoll2Result = cardVm.DiceRoll2Result,
                DiceRoll3Result = cardVm.DiceRoll3Result,
                DiceRoll4Result = cardVm.DiceRoll4Result,
                DiceRoll5Result = cardVm.DiceRoll5Result,
                DiceRoll6Result = cardVm.DiceRoll6Result,
                ImageId = cardVm.ImageId,
                EnemyId = cardVm.EnemyId
            };

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            return Ok(card);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCardById(int id) {
            var card = await _context.Cards
                .Include(c => c.Image)
                .Include(c => c.Enemy)
                .FirstOrDefaultAsync(c => c.CardId == id);

            if (card == null) {
                return NotFound();
            }

            return Ok(card);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCard(int id, [FromBody] CardVM cardVm) {
            var card = await _context.Cards.FindAsync(id);
            if (card == null) {
                return NotFound();
            }

            card.Title = cardVm.Title;
            card.Description = cardVm.Description;
            card.SpecialAbilities = cardVm.SpecialAbilities;
            card.DiceRoll1Result = cardVm.DiceRoll1Result;
            card.DiceRoll2Result = cardVm.DiceRoll2Result;
            card.DiceRoll3Result = cardVm.DiceRoll3Result;
            card.DiceRoll4Result = cardVm.DiceRoll4Result;
            card.DiceRoll5Result = cardVm.DiceRoll5Result;
            card.DiceRoll6Result = cardVm.DiceRoll6Result;
            card.ImageId = cardVm.ImageId;
            card.EnemyId = cardVm.EnemyId;

            _context.Cards.Update(card);
            await _context.SaveChangesAsync();

            return Ok(card);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(int id) {
            var card = await _context.Cards.FindAsync(id);
            if (card == null) {
                return NotFound();
            }

            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

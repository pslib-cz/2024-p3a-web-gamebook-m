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
    public class CardsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CardsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> CreateCard([FromBody] CardCreateVM cardVm)
        {
            var card = new Card
            {
                Title = cardVm.Title,
                Type = cardVm.Type,
                Description = cardVm.Description,
                SpecialAbilities = cardVm.SpecialAbilities,
                DiceRollResults = cardVm.DiceRollResults?.ToDictionary(kvp => kvp.Key, kvp => kvp.Value),
                ImageId = cardVm.ImageId,
                EnemyId = cardVm.EnemyId,
                BonusWile = cardVm.BonusWile,
                BonusStrength = cardVm.BonusStrength,
                BonusHP = cardVm.BonusHP,
                ClassOnly = cardVm.ClassOnly

            };

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCardById), new { id = card.CardId }, card);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
            {
                return NotFound();
            }

            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCardById(int id)
        {
            var card = await _context.Cards
                .Include(c => c.Image)
                .Include(c => c.Enemy)
                .FirstOrDefaultAsync(c => c.CardId == id);

            if (card == null)
            {
                return NotFound();
            }

            return Ok(new CardDetailVM
            {
                Id = card.CardId,
                Title = card.Title,
                Type = card.Type,
                Description = card.Description,
                SpecialAbilities = card.SpecialAbilities,
                ImageId = card.ImageId,
                EnemyId = card.EnemyId,
                EnemyName = card.Enemy?.Name,
                ImageName = card.Image?.Name,
                DiceRollResults = card.DiceRollResults,
                BonusWile = card.BonusWile,
                BonusStrength = card.BonusStrength,
                BonusHP = card.BonusHP,
                ClassOnly = card.ClassOnly
            });
        }

        [HttpGet]
        public async Task<ActionResult<ListResult<CardListVM>>> GetCards([FromQuery] int? page = 0, [FromQuery] int? size = 100)
        {
            var query = _context.Cards.AsQueryable();

            var total = await query.CountAsync();
            var cards = await query
                .Skip((page ?? 0) * (size ?? 100))
                .Take(size ?? 100)
                .Select(c => new CardListVM
                {
                    Id = c.CardId,
                    Title = c.Title,
                    Type = c.Type,
                    EnemyId = c.EnemyId,
                    ImageId = c.ImageId
                })
                .ToListAsync();

            return Ok(new ListResult<CardListVM>
            {
                Total = total,
                Items = cards,
                Count = cards.Count,
                Page = page ?? 0,
                Size = size ?? 100
            });
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Author)]
        public async Task<IActionResult> UpdateCard(int id, [FromBody] CardCreateVM cardVm)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
            {
                return NotFound();
            }

            card.Title = cardVm.Title;
            card.Type = cardVm.Type;
            card.Description = cardVm.Description;
            card.SpecialAbilities = cardVm.SpecialAbilities;
            card.DiceRollResults = cardVm.DiceRollResults?.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            card.ImageId = cardVm.ImageId;
            card.EnemyId = cardVm.EnemyId;
            card.BonusHP = cardVm.BonusHP;
            card.BonusStrength = cardVm.BonusStrength;
            card.BonusWile = cardVm.BonusWile;
            card.ClassOnly = cardVm.ClassOnly;


            _context.Cards.Update(card);
            await _context.SaveChangesAsync();

            return Ok(card);
        }
    }
}
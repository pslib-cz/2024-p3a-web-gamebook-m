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
    public class InventoriesController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public InventoriesController(ApplicationDbContext context) {
            _context = context;
        }

        // GET /api/inventories
        [HttpGet]
        public async Task<ActionResult<ListResult<InventoryListVM>>> GetInventories([FromQuery] int? page = 0, [FromQuery] int? size = 10) {
            var query = _context.Inventories.Include(i => i.Cards).AsQueryable();

            var total = await query.CountAsync();
            var inventories = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(i => new InventoryListVM {
                    Id = i.InventoryId,
                    CardIds = i.Cards.Select(c => c.CardId).ToList()
                })
                .ToListAsync();

            return Ok(new ListResult<InventoryListVM> {
                Total = total,
                Items = inventories,
                Count = inventories.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // GET /api/inventories/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInventoryById(int id) {
            var inventory = await _context.Inventories
                .Include(i => i.Cards)
                .FirstOrDefaultAsync(i => i.InventoryId == id);

            if (inventory == null) {
                return NotFound();
            }

            return Ok(new InventoryDetailVM {
                Id = inventory.InventoryId,
                CardIds = inventory.Cards.Select(c => c.CardId).ToList()
            });
        }

        // POST /api/inventories
        [HttpPost]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> CreateInventory([FromBody] InventoryCreateVM inventoryVm) {
            var cards = await _context.Cards.Where(c => inventoryVm.CardIds.Contains(c.CardId)).ToListAsync();

            if (cards.Count != inventoryVm.CardIds.Count) {
                return BadRequest("Some CardIds are invalid.");
            }

            var inventory = new Inventory {
                Cards = cards
            };

            _context.Inventories.Add(inventory);
            await _context.SaveChangesAsync();

            return Ok(inventory);
        }

        // PUT /api/inventories/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> UpdateInventory(int id, [FromBody] InventoryCreateVM inventoryVm) {
            var inventory = await _context.Inventories.Include(i => i.Cards).FirstOrDefaultAsync(i => i.InventoryId == id);
            if (inventory == null) {
                return NotFound();
            }

            var cards = await _context.Cards.Where(c => inventoryVm.CardIds.Contains(c.CardId)).ToListAsync();

            if (cards.Count != inventoryVm.CardIds.Count) {
                return BadRequest("Some CardIds are invalid.");
            }

            inventory.Cards = cards;

            _context.Inventories.Update(inventory);
            await _context.SaveChangesAsync();

            return Ok(inventory);
        }

        // DELETE /api/inventories/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> DeleteInventory(int id) {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null) {
                return NotFound();
            }

            _context.Inventories.Remove(inventory);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPost("add-card")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> AddCardToInventory([FromBody] AddCardToInventoryVM inventoryVm) {
            var inventory = await _context.Inventories.Include(i => i.Cards).FirstOrDefaultAsync(i => i.InventoryId == inventoryVm.InventoryId);
            if (inventory == null) {
                return NotFound("Inventory not found.");
            }

            var card = await _context.Cards.FindAsync(inventoryVm.CardId);
            if (card == null) {
                return NotFound("Card not found.");
            }

            // Přidání karty do inventáře
            if (!inventory.Cards.Any(c => c.CardId == inventoryVm.CardId)) {
                inventory.Cards.Add(card);
                await _context.SaveChangesAsync();
            }

            return Ok(inventory);
        }

        // Odstraní kartu z inventáře
        [HttpPost("remove-card")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> DeleteCardFromInventory([FromBody] RemoveCardFromInventoryVM inventoryVm) {
            var inventory = await _context.Inventories.Include(i => i.Cards).FirstOrDefaultAsync(i => i.InventoryId == inventoryVm.InventoryId);
            if (inventory == null) {
                return NotFound("Inventory not found.");
            }

            var card = inventory.Cards.FirstOrDefault(c => c.CardId == inventoryVm.CardId);
            if (card == null) {
                return NotFound("Card not found in the inventory.");
            }

            // Odebrání karty z inventáře
            inventory.Cards.Remove(card);
            await _context.SaveChangesAsync();

            return Ok(inventory);
        }
    }
}

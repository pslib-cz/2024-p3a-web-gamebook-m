using Gamebook.Server.Data;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
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

        // GET: api/inventories
        [HttpGet]
        public async Task<ActionResult<ListResult<InventoryVM>>> GetInventories(int? page = null, int? size = null) {
            var query = _context.Inventories.Include(i => i.Cards).AsQueryable();

            var total = await query.CountAsync();
            var inventories = await query
                .Skip((page ?? 0) * (size ?? 10))
                .Take(size ?? 10)
                .Select(i => new InventoryVM {
                    InventoryId = i.InventoryId,
                    CardIds = i.Cards.Select(c => c.CardId).ToList()
                })
                .ToListAsync();

            return Ok(new ListResult<InventoryVM> {
                Total = total,
                Items = inventories,
                Count = inventories.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        // POST: api/inventories
        [HttpPost]
        public async Task<IActionResult> CreateInventory([FromBody] InventoryVM inventoryVm) {

            // Retrieve the cards based on the IDs
            var cards = await _context.Cards
                .Where(c => inventoryVm.CardIds.Contains(c.CardId))
                .ToListAsync();

            // Create a new Inventory and associate the cards with it
            var inventory = new Inventory {
                Cards = cards
            };

            // Add the inventory to the database
            _context.Inventories.Add(inventory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventories), new { id = inventory.InventoryId }, inventory);
        }

        // PUT: api/inventories/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventory(int id, [FromBody] InventoryVM inventoryVm) {
            var inventory = await _context.Inventories.Include(i => i.Cards).FirstOrDefaultAsync(i => i.InventoryId == id);
            if (inventory == null) {
                return NotFound();
            }

            if (inventoryVm.CardIds == null || inventoryVm.CardIds.Count == 0) {
                return BadRequest("At least one CardId must be provided.");
            }

            // Retrieve the cards based on the IDs
            var cards = await _context.Cards
                .Where(c => inventoryVm.CardIds.Contains(c.CardId))
                .ToListAsync();

            // Update the inventory's cards
            inventory.Cards = cards;

            _context.Inventories.Update(inventory);
            await _context.SaveChangesAsync();

            return Ok(inventory);
        }

        // DELETE: api/inventories/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(int id) {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null) {
                return NotFound();
            }

            _context.Inventories.Remove(inventory);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

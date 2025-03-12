using Gamebook.Server.Constants;
using Gamebook.Server.Models;
using Gamebook.Server.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Policy = Policy.Admin)]
        public async Task<ActionResult<ListResult<UserListVM>>> GetUsers(string? username, string? email, string? roleId, UsersOrderBy order = UsersOrderBy.Id, int? page = null, int? size = null)
        {
            var query = _userManager.Users.Include(x => x.Roles).AsQueryable();
            int total = await query.CountAsync();
            if (!string.IsNullOrWhiteSpace(username))
            {
                query = query.Where(u => u.UserName!.Contains(username));
            }
            if (!string.IsNullOrWhiteSpace(email))
            {
                query = query.Where(u => u.Email!.Contains(email));
            }
            if (!string.IsNullOrWhiteSpace(roleId))
            {
                query = query.Where(u => u.Roles!.Any(r => r.Id == roleId));
            }
            query = order switch
            {
                UsersOrderBy.Id => query.OrderBy(u => u.Id),
                UsersOrderBy.IdDesc => query.OrderByDescending(u => u.Id),
                UsersOrderBy.Username => query.OrderBy(u => u.UserName),
                UsersOrderBy.UsernameDesc => query.OrderByDescending(u => u.UserName),
                UsersOrderBy.Email => query.OrderBy(u => u.Email),
                UsersOrderBy.EmailDesc => query.OrderByDescending(u => u.Email),
                _ => query.OrderBy(u => u.Id)
            };
            var users = await query.Select(u => new UserListVM
            {
                Id = u.Id,
                UserName = u.UserName!,
                Email = u.Email!,
                Roles = u.Roles
            }).Skip((page ?? 0) * (size ?? 10)).Take(size ?? 10).ToListAsync();
            return Ok(new ListResult<UserListVM>
            {
                Total = total,
                Items = users,
                Count = users.Count,
                Page = page ?? 0,
                Size = size ?? 10
            });
        }

        [HttpPost]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> CreateUser([FromBody] RegisterUserVM userVM)
        {
            if (string.IsNullOrWhiteSpace(userVM.UserName))
            {
                return BadRequest("Username is required.");
            }

            var user = new User
            {
                UserName = userVM.UserName,
                Email = userVM.Email
            };

            var result = await _userManager.CreateAsync(user, userVM.Password);
            if (result.Succeeded)
            {
                return Ok(new
                {
                    user.Id,
                    user.UserName,
                    user.Email
                });
            }
            return BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email
            });
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(user);
            }
            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }
            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }

        [HttpGet("{id}/role")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> GetUserRoles(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(roles);
        }

        [HttpPost("{id}/role")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> AddUserRole(Guid id, [FromBody] string role)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }
            var result = await _userManager.AddToRoleAsync(user, role);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}/role")]
        [Authorize(Policy = Policy.Admin)]
        public async Task<IActionResult> RemoveUserRole(Guid id, [FromBody] string role)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }
            var result = await _userManager.RemoveFromRoleAsync(user, role);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }
    }

    public class RegisterUserVM
    {
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public enum UsersOrderBy
    {
        Id,
        IdDesc,
        Username,
        UsernameDesc,
        Email,
        EmailDesc
    }
}

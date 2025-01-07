namespace Gamebook.Server.ViewModels
{
    public class RegisterVM
    {
        public required string Email { get; set; }
        public required string Username { get; set; } // Přezdívka
        public required string Password { get; set; }
    }
}

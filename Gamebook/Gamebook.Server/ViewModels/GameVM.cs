public class GameVM {
    public int GameId { get; set; }
    public string UserId { get; set; }
    public int GameStateId { get; set; }
    public string UserName { get; set; } // Assuming User has UserName
    public string GameStateName { get; set; } // This could be GameState.ToString() or an appropriate property
}

using Engine;

public enum BotDifficulty
{
    Easy,
    Medium,
    Hard,
    Impossible
}

public class BotConfigurations
{
	public static BotData GetBot(BotDifficulty difficulty) => BotConfigurations.Bots[difficulty];
    private static readonly Dictionary<BotDifficulty, BotData> Bots = new()
    {
        {
            BotDifficulty.Easy,
            new BotData
            {
                Name = "Limping Liam",
                CustomIntroMessage = "He can't jump far",
                CustomLoseMessage = "Oh no",
                CustomWinMessage = "Easy",
                QuickestResponseTimeMs = 3000,
                SlowestResponseTimeMs = 5000,
                PickupIntervalMs = 2500
            }
        },
        {
            BotDifficulty.Medium,
            new BotData
            {
                Name = "Harrowing Hayden",
                CustomIntroMessage = "He's a bit of a trickster so watch out",
                CustomLoseMessage = "Damn, he's tricky",
                CustomWinMessage = "Down goes the trickster",
                QuickestResponseTimeMs = 2000,
                SlowestResponseTimeMs = 3000,
                PickupIntervalMs = 1500
            }
        },
        {
            BotDifficulty.Hard,
            new BotData
            {
                Name = "Masterful Mikaela",
                CustomIntroMessage = "She can't be trusted",
                CustomLoseMessage = "Oof, rough one",
                CustomWinMessage = "Down falls Mikaela and her wicked ways",
                QuickestResponseTimeMs = 1000,
                SlowestResponseTimeMs = 3000,
                PickupIntervalMs = 1000
            }
        },
        {
            BotDifficulty.Impossible,
            new BotData
            {
                Name = "Chaotic Kate",
                CustomIntroMessage = "rip lol",
                CustomLoseMessage = "No chance",
                CustomWinMessage = "No one will ever see this message so it doesn't matter",
                QuickestResponseTimeMs = 500,
                SlowestResponseTimeMs = 2000,
                PickupIntervalMs = 500
            }
        }
    };
}

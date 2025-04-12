# MoP Raid Buff Coverage Calculator
A web-based tool for planning and optimizing 10-player raid compositions for 
World of Warcraft: Mists of Pandaria. This calculator helps raid leaders ensure their 
team has all necessary buffs and abilities for successful raiding.

## Specifications
Most available raid compositor do not take into account mutually exclusive buffs 
such as Hunter Pets, Warrior Shouts, etc., providing inaccurate information or leaving
some manual actions on the user.  

Here, we use Integer Linear Programming to find the best raid buff layout. We focus on the following
key objectives:
- Completeness: Each buff is provided by at least one member
- Flexibility: Have another provider in reserve, in case of a missing player

## How to Use

1. **Build Your Raid**: Drag class specializations from the palette on the left to the raid slots
2. **Analyze Buffs**: Click "Analyze Buffs" to see which raid buffs your composition provides
3. **Share Your Setup**: Use the "Share" button to copy a URL that contains your raid composition
4. **Adjust as Needed**: Drag classes between slots or back to the palette to refine your setup

## Installation

```bash
# Clone the repository
git clone https://github.com/SimonManour/mop-raid-composer.git
# Navigate to the project directory
cd mop-raid-composer
# Install dependencies
npm install
# Start the development server
npm run dev
```

## License
This project is licensed under the [Yolo License](https://github.com/pjreddie/darknet/blob/master/LICENSE)

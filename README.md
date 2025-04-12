# MoP Raid Buff Coverage Calculator

Most available raid compositor do not take into account mutually exclusive buffs 
such as Hunter Pets, Warrior Shouts, etc., providing inaccurate information or leaving
some manual actions on the user.  

Here, we use Integer Linear Programming to find the best raid buff layout. We focus on the following
key objectives:
- Completeness: Each buff is provided by at least one member
- Flexibility: Have another provider in reserve, in case of a missing player


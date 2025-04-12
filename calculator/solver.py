import dataclasses
import logging
import sys

# Custom formatter without milliseconds
formatter = logging.Formatter(
    fmt='[%(levelname)s]-[%(asctime)s]-[%(filename)s:%(lineno)d] - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'  # No milliseconds here
)

# Set up handler for stdout
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(formatter)

# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Or INFO, WARNING, etc.
logger.handlers = [handler]  # Replace existing handlers
logger.propagate = False  # Prevent double logging

@dataclasses.dataclass
class PartialSolution:
    optimal: bool
    assignment: dict[str, list[str]]
    values: dict[str, int]


def solve_partial(composition: list[str], lb: int, ub: int, low_bounds: dict[str, int]) -> PartialSolution:
    import pulp
    from pulp import LpProblem, LpStatus, lpSum, LpMaximize, PULP_CBC_CMD
    from collections import defaultdict
    problem = LpProblem('RaidBuffCoverage', LpMaximize)

    # 10% AttackPower
    horn_of_winter = pulp.LpVariable('Horn Of Winter', cat='Integer')
    true_shot_aura = pulp.LpVariable('True Shot Aura', cat='Integer')
    battle_shout = pulp.LpVariable('Battle Shout', cat='Integer')
    attack_power = (horn_of_winter, true_shot_aura, battle_shout)

    # 10% Attack Speed
    unholy_aura = pulp.LpVariable('Unholy Aura', cat='Integer')
    hyena_pet = pulp.LpVariable('Hyena Pet', cat='Integer')
    swiftblade = pulp.LpVariable('Swift Blade', cat='Integer')
    unleashed_rage = pulp.LpVariable('Unleashed Rage', cat='Integer')
    attack_speed = (unholy_aura, hyena_pet, swiftblade, unleashed_rage)

    # 10% Sp
    still_water_exo_pet = pulp.LpVariable('Water Strider Exotic', cat='Integer')
    arcane_brilliance = pulp.LpVariable('Arcane Brilliance', cat='Integer')
    burning_wrath = pulp.LpVariable('Burning Wrath', cat='Integer')
    dark_intent = pulp.LpVariable('Dark Intent', cat='Integer')
    spell_power = (still_water_exo_pet, arcane_brilliance, burning_wrath, dark_intent)

    # +5% Spell Haste
    moonkin_aura = pulp.LpVariable('Moonkin', cat='Integer')
    sporebat_pet = pulp.LpVariable('Sporebat Pet', cat='Integer')
    shadow_form = pulp.LpVariable('Shadow Form', cat='Integer')
    elemental_oath = pulp.LpVariable('Elemental Oath', cat='Integer')
    spell_haste = (moonkin_aura, sporebat_pet, shadow_form, elemental_oath)

    # +5% Critical Strike Chance
    leader_of_pack = pulp.LpVariable('Leader of Pack', cat='Integer')
    devil_exo_pet = pulp.LpVariable('Devilsaur Exotic', cat='Integer')
    wolf_pet = pulp.LpVariable('Wolf Pet', cat='Integer')
    # ++ Arcane brilliance
    tiger_legacy = pulp.LpVariable('Tiger Legacy', cat='Integer')
    critical_chance = (leader_of_pack, devil_exo_pet, still_water_exo_pet, wolf_pet, tiger_legacy, arcane_brilliance)

    # 3000 Mastery
    cat_pet = pulp.LpVariable('Cat Pet', cat='Integer')
    spirit_exo_pet = pulp.LpVariable('Spirit Beast Exotic', cat='Integer')
    pala_might = pulp.LpVariable('Blessing of Might', cat='Integer')
    shaman_grace = pulp.LpVariable('Grace of Air', cat='Integer')
    mastery = (cat_pet, spirit_exo_pet, pala_might, shaman_grace)

    # 5% Stats
    druid_mark = pulp.LpVariable('Mark of Wild', cat='Integer')
    spider_exo_pet = pulp.LpVariable('Shale Spider Exotic', cat='Integer')
    emperor_legacy = pulp.LpVariable('Emperor Legacy', cat='Integer')
    pala_kings = pulp.LpVariable('Blessing of Kings', cat='Integer')
    stats = (druid_mark, spider_exo_pet, emperor_legacy, pala_kings)

    # 10% Stamina
    silithid_exo_pet = pulp.LpVariable('Qiraji Exotic', cat='Integer')
    fortitude = pulp.LpVariable('Fortitude', cat='Integer')
    # ++ Dark intent
    command_shout = pulp.LpVariable('Commanding Shout', cat='Integer')
    stamina = (silithid_exo_pet, fortitude, dark_intent, command_shout)

    # 4% Physical
    ebon_brittle = pulp.LpVariable('DK Plague', cat='Integer')
    ravager_pet = pulp.LpVariable('Ravager Pet', cat='Integer')
    judgement_bold = pulp.LpVariable('Judgement of the Bold', cat='Integer')
    colossus = pulp.LpVariable('Colossus Smash', cat='Integer')
    physical_damage = (ebon_brittle, ravager_pet, judgement_bold, colossus)

    # 12% Armor
    faerie_fire = pulp.LpVariable('Faerie Fire', cat='Integer')
    raptor_pet = pulp.LpVariable('Raptor Pet', cat='Integer')
    expose_armor = pulp.LpVariable('Expose Armor', cat='Integer')
    sunder_armor = pulp.LpVariable('Sunder Armor', cat='Integer')
    armor = (faerie_fire, raptor_pet, expose_armor, sunder_armor)

    # 5% Spell Damage
    dragon_hawk_pet = pulp.LpVariable('Dragon Hawk Pet', cat='Integer')
    master_poisoner = pulp.LpVariable('Master Poisoner', cat='Integer')
    curse_of_elements = pulp.LpVariable('Curse of Elements', cat='Integer')
    spell_damage = (dragon_hawk_pet, master_poisoner, curse_of_elements)

    requirements = {
        '10% Attack Power': attack_power,
        '10% Attack Speed': attack_speed,
        '10% Spell Power': spell_power,
        '5% Spell Haste': spell_haste,
        '5% Crit': critical_chance,
        '3000 Mastery': mastery,
        '5% Stats': stats,
        '10% Stamina': stamina,
        '4% Physical Damage': physical_damage,
        '12% Armor': armor,
        '5% Spell Damage': spell_damage,
    }

    # Set low bounds according to input spec
    for variables in requirements.values():
        for variable in variables:
            variable.lowBound = low_bounds[variable.name] if variable.name in low_bounds else 0

    for variables in requirements.values():
        problem += lpSum(variables) <= ub
        problem += lb <= lpSum(variables)

    pets = (hyena_pet, sporebat_pet, wolf_pet, cat_pet, ravager_pet, raptor_pet, dragon_hawk_pet)
    exotic_pets = (spider_exo_pet, spirit_exo_pet, devil_exo_pet, silithid_exo_pet, still_water_exo_pet)

    class_buffs = {
        'dk': [horn_of_winter],
        'hunter': [true_shot_aura, pets],
        'warrior': [(battle_shout, command_shout), sunder_armor],
        'rogue': [swiftblade, expose_armor, master_poisoner],
        'shaman': [burning_wrath, shaman_grace],
        'mage': [arcane_brilliance],
        'druid': [druid_mark, faerie_fire],
        'monk': [emperor_legacy, tiger_legacy],
        'priest': [fortitude],
        'warlock': [dark_intent, curse_of_elements],
        'paladin': [(pala_might, pala_kings)],
        # Now Specializations
        'dk_dps': [unholy_aura, ebon_brittle],
        'shaman_enha': [unleashed_rage],
        'shaman_ele': [elemental_oath],
        'druid_feral': [leader_of_pack],
        'druid_bala': [moonkin_aura],
        'hunter_bm': [exotic_pets],
        'priest_sh': [shadow_form],
        'paladin_ret': [judgement_bold],
        'warrior_dps': [colossus]
    }

    classes_basic: dict[str, int] = defaultdict(lambda: 0)
    classes_special: dict[str, int] = defaultdict(lambda: 0)
    for member in composition:
        classes_basic[member.split('_')[0]] += 1
        if '_' in member:
            classes_special[member] += 1

    logger.info(f'Basic classes: {dict(classes_basic)}')
    logger.info(f'Specializations: {dict(classes_special)}')

    # Special condition - no more pets than hunters
    problem += lpSum(pets) + lpSum(exotic_pets) <= classes_basic['hunter']

    for cls, buffs in class_buffs.items():
        count = classes_special[cls] if '_' in cls else classes_basic[cls]
        for buf in buffs:
            problem += lpSum(buf) <= count

    all_vars = []
    for requirement in requirements.values():
        all_vars += requirement
    problem += lpSum(all_vars)

    # Solve
    problem.solve(PULP_CBC_CMD(msg=False))
    if LpStatus[problem.status] != "Optimal":
        logger.info("Missing buffs — this raid setup is not sufficient.")
        return PartialSolution(False, {}, {})

    logger.info("All required buffs are covered with a valid setup.")
    solution: dict[str, list[str]] = {}
    values: dict[str, int] = {}

    for buff_type, variables in requirements.items():
        solution[buff_type] = [var.name for var in variables if var.varValue >= 1]
        values.update({var.name: var.varValue for var in variables})

    return PartialSolution(True, solution, values)


def solve(composition: list[str]) -> dict[str, dict[str, int]]:
    logger.info(f'Solving for: {composition}')

    # Initial solution without a low bound requirement
    best_solution: PartialSolution = solve_partial(composition, 0, 1, {})
    low_bound: int = 0
    upper_bound: int = 1
    solution_found: bool = True

    while solution_found:
        logger.info(f'Solving with low bound: {low_bound + 1}, upper bound: {upper_bound + 1}')
        partial_solution: PartialSolution = solve_partial(composition, low_bound + 1, upper_bound + 1, low_bounds={})
        solution_found = partial_solution.optimal
        if solution_found:
            low_bound, upper_bound, best_solution = low_bound + 1, upper_bound + 1, partial_solution

    logger.info(f'>> Solving with locked best solution, unbounded')
    # Use big M as upper bound to allow the most buffs without losing existing ones
    solution = solve_partial(composition, low_bound, ub=1000, low_bounds=best_solution.values)
    logger.info(f'Current solution: {solution.assignment}')
    logger.info(f'...With values: {solution.values}')

    ret: dict[str, dict[str, int]] = {}
    for buff_type, buffs in solution.assignment.items():
        ret[buff_type] = {}
        for buff in buffs:
            ret[buff_type][buff] = solution.values[buff]

    logger.info(ret)
    return ret

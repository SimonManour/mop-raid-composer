from flask import Flask
import pulp

app = Flask(__name__)


def lp():
    from collections import defaultdict

    import pulp
    from pulp import LpProblem, LpStatus, lpSum, LpMaximize

    problem = LpProblem('RaidBuffCoverage', LpMaximize)

    T = pulp.LpVariable('T', lowBound=0, cat='Integer')

    # 10% AttackPower
    horn_of_winter = pulp.LpVariable('horn_of_winter', lowBound=0, cat='Integer')
    true_shot_aura = pulp.LpVariable('true_shot_aura', lowBound=0, cat='Integer')
    battle_shout = pulp.LpVariable('battle_shout', lowBound=0, cat='Integer')
    attack_power = (horn_of_winter, true_shot_aura, battle_shout)

    # 10% Attack Speed
    unholy_aura = pulp.LpVariable('unholy_aura', lowBound=0, cat='Integer')
    hyena_pet = pulp.LpVariable('hyena_pet', lowBound=0, cat='Integer')
    swiftblade = pulp.LpVariable('swiftblade', lowBound=0, cat='Integer')
    unleashed_rage = pulp.LpVariable('unleashed_rage', lowBound=0, cat='Integer')
    attack_speed = (unholy_aura, hyena_pet, swiftblade, unleashed_rage)

    # 10% Sp
    still_water_exo_pet = pulp.LpVariable('still_water_exo_pet', lowBound=0, cat='Integer')
    arcane_brilliance = pulp.LpVariable('arcane_brilliance', lowBound=0, cat='Integer')
    burning_wrath = pulp.LpVariable('burning_wrath', lowBound=0, cat='Integer')
    dark_intent = pulp.LpVariable('dark_intent', lowBound=0, cat='Integer')
    spell_power = (still_water_exo_pet, arcane_brilliance, battle_shout, dark_intent)

    # +5% Spell Haste
    moonkin_aura = pulp.LpVariable('moonkin', lowBound=0, cat='Integer')
    sporebat_pet = pulp.LpVariable('sporebat_pet', lowBound=0, cat='Integer')
    shadow_form = pulp.LpVariable('shadow_form', lowBound=0, cat='Integer')
    elemental_oath = pulp.LpVariable('elemental_oath', lowBound=0, cat='Integer')
    spell_haste = (moonkin_aura, sporebat_pet, shadow_form, elemental_oath)

    # +5% Critical Strike Chance
    leader_of_pack = pulp.LpVariable('leader_pack', lowBound=0, cat='Integer')
    devil_exo_pet = pulp.LpVariable('devil_exo_pet', lowBound=0, cat='Integer')
    strider_exo_pet = pulp.LpVariable('strider_exo_pet', lowBound=0, cat='Integer')
    wolf_pet = pulp.LpVariable('wolf_pet', lowBound=0, cat='Integer')
    # ++ Arcane brilliance
    tiger_legacy = pulp.LpVariable('tiger_legacy', lowBound=0, cat='Integer')
    critical_chance = (leader_of_pack, devil_exo_pet, strider_exo_pet, wolf_pet, tiger_legacy, arcane_brilliance)

    # 3000 Mastery
    cat_pet = pulp.LpVariable('cat_pet', lowBound=0, cat='Integer')
    spirit_exo_pet = pulp.LpVariable('spirit_exo_pet', lowBound=0, cat='Integer')
    pala_might = pulp.LpVariable('pala_might', lowBound=0, cat='Integer')
    shaman_grace = pulp.LpVariable('shaman_grace', lowBound=0, cat='Integer')
    mastery = (cat_pet, spirit_exo_pet, pala_might, shaman_grace)

    # 5% Stats
    druid_mark = pulp.LpVariable('druid_mark', lowBound=0, cat='Integer')
    spider_exo_pet = pulp.LpVariable('spider_exo_pet', lowBound=0, cat='Integer')
    emperor_legacy = pulp.LpVariable('emperor_legacy', lowBound=0, cat='Integer')
    pala_kings = pulp.LpVariable('pala_kings', lowBound=0, cat='Integer')
    stats = (druid_mark, spider_exo_pet, emperor_legacy, pala_kings)

    # 10% Stamina
    silithid_exo_pet = pulp.LpVariable('silithid_exo_pet', lowBound=0, cat='Integer')
    fortitude = pulp.LpVariable('fortitude', lowBound=0, cat='Integer')
    # ++ Dark intent
    command_shout = pulp.LpVariable('command_shout', lowBound=0, cat='Integer')
    stamina = (silithid_exo_pet, fortitude, dark_intent, command_shout)

    # 4% Physical
    ebon_brittle = pulp.LpVariable('ebon_brittle', lowBound=0, cat='Integer')
    ravager_pet = pulp.LpVariable('ravager_pet', lowBound=0, cat='Integer')
    judgement_bold = pulp.LpVariable('judgement_bold', lowBound=0, cat='Integer')
    colossus = pulp.LpVariable('colossus', lowBound=0, cat='Integer')
    physical_damage = (ebon_brittle, ravager_pet, judgement_bold, colossus)

    # 12% Armor
    faerie_fire = pulp.LpVariable('faerie_fire', lowBound=0, cat='Integer')
    raptor_pet = pulp.LpVariable('raptor_pet', lowBound=0, cat='Integer')
    expose_armor = pulp.LpVariable('expose_armor', lowBound=0, cat='Integer')
    sunder_armor = pulp.LpVariable('sunder_armor', lowBound=0, cat='Integer')
    armor = (faerie_fire, raptor_pet, expose_armor, sunder_armor)

    # 5% Spell Damage
    dragon_hawk_pet = pulp.LpVariable('dragon_hawk_pet', lowBound=0, cat='Integer')
    master_poisoner = pulp.LpVariable('master_poisoner', lowBound=0, cat='Integer')
    curse_of_elements = pulp.LpVariable('curse_of_elements', lowBound=0, cat='Integer')
    spell_damage = (dragon_hawk_pet, master_poisoner, curse_of_elements)

    requirements = {
        '10% AttackPower': attack_power,
        '10% AttackSpeed': attack_speed,
        '5% Spell Haste': spell_haste,
        '5% Crit': critical_chance,
        '3000 Mastery': mastery,
        '5% Stats': stats,
        '10% Stamina': stamina,
        '4% Physical Damage': physical_damage,
        '12% Armor': armor,
        '5% Spell Damage': spell_damage,
    }

    for variables in requirements.values():
        problem += lpSum(variables) <= 1

    pets = (hyena_pet, sporebat_pet, wolf_pet, cat_pet, ravager_pet, raptor_pet, dragon_hawk_pet)
    exotic_pets = (
        spider_exo_pet, strider_exo_pet, spirit_exo_pet, devil_exo_pet, silithid_exo_pet, still_water_exo_pet)

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

    # raid = [
    #     'dk_blood',
    #     'monk_brew',
    #     'druid_resto',
    #     'rogue_assa',
    #     'priest_sh',
    #     'warlock_destro',
    #     'warrior_dps',
    #     'shaman_ele',
    #     'shaman_resto',
    #     'mage_frost'
    # ]

    raid = [
        'paladin_prot',
        'monk_brew',
        'priest_disc',
        'druid_bala',
        'rogue',
        'warrior_dps',
        'dk_dps',
        'warlock',
        'mage',
        'rogue'
    ]

    classes_basic: dict[str, int] = defaultdict(lambda: 0)
    classes_special: dict[str, int] = defaultdict(lambda: 0)
    for member in raid:
        classes_basic[member.split('_')[0]] += 1
        if '_' in member:
            classes_special[member] += 1

    print(f'Basic classes: {dict(classes_basic)}')
    print(f'Specializations: {dict(classes_special)}')

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
    problem.solve()
    if LpStatus[problem.status] == "Optimal":
        print("All required buffs are covered with a valid setup.")
    else:
        print("Missing buffs — this raid setup is not sufficient.")

    lines = ['Summary:']
    for buff_type, variables in requirements.items():
        has_buffs = [var.name for var in variables if var.varValue >= 1]
        lines.append(f'{buff_type}: {has_buffs}')

    return lines

@app.route("/api/python")
def hello_world():
    lines = lp()
    return f"<p>{'</br>'.join(lines)}!</p>"

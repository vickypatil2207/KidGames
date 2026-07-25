/* ==========================================================================
   10 Dynamic Level Configurations for 3D Archery Game
   ========================================================================== */

const LEVELS = [
    {
        id: 1,
        title: "Bottle Blast",
        targetType: "bottles",
        icon: "🍾",
        description: "Break 5 soda bottles resting on wooden barrels!",
        distance: 15,
        arrows: 5,
        wind: { min: 0, max: 0 },
        passScore: 3, // bottles
        stars: { one: 3, two: 4, three: 5 },
        targets: [
            { pos: [-1.2, 1.2, -15], type: 'bottle' },
            { pos: [-0.6, 1.2, -15], type: 'bottle' },
            { pos: [0.0, 1.2, -15], type: 'bottle' },
            { pos: [0.6, 1.2, -15], type: 'bottle' },
            { pos: [1.2, 1.2, -15], type: 'bottle' }
        ]
    },
    {
        id: 2,
        title: "Apple Rush",
        targetType: "apples",
        icon: "🍎",
        description: "Hit 6 crisp red apples placed on wooden posts!",
        distance: 20,
        arrows: 6,
        wind: { min: 0, max: 0.5 },
        passScore: 4, // apples
        stars: { one: 4, two: 5, three: 6 },
        targets: [
            { pos: [-1.5, 1.4, -20], type: 'apple' },
            { pos: [-0.9, 1.6, -20], type: 'apple' },
            { pos: [-0.3, 1.3, -20], type: 'apple' },
            { pos: [0.3, 1.5, -20], type: 'apple' },
            { pos: [0.9, 1.2, -20], type: 'apple' },
            { pos: [1.5, 1.4, -20], type: 'apple' }
        ]
    },
    {
        id: 3,
        title: "Bouncing Footballs",
        targetType: "footballs",
        icon: "⚽",
        description: "Hit 5 bouncing footballs leaping in the air!",
        distance: 20,
        arrows: 6,
        wind: { min: 0, max: 1.0 },
        passScore: 3,
        stars: { one: 3, two: 4, three: 5 },
        targets: [
            { pos: [-1.6, 1.5, -20], type: 'football', bounceSpeed: 2.0, bounceAmp: 0.8 },
            { pos: [-0.8, 1.2, -20], type: 'football', bounceSpeed: 2.5, bounceAmp: 1.0 },
            { pos: [0.0, 1.8, -20], type: 'football', bounceSpeed: 1.8, bounceAmp: 0.6 },
            { pos: [0.8, 1.4, -20], type: 'football', bounceSpeed: 2.8, bounceAmp: 0.9 },
            { pos: [1.6, 1.6, -20], type: 'football', bounceSpeed: 2.2, bounceAmp: 0.7 }
        ]
    },
    {
        id: 4,
        title: "Classic Bullseye",
        targetType: "target_board",
        icon: "🎯",
        description: "Hit the classic target board! Aim for the 10-point Bullseye!",
        distance: 30,
        arrows: 5,
        wind: { min: 0, max: 1.5 },
        passScore: 35, // total points
        stars: { one: 35, two: 42, three: 48 },
        targets: [
            { pos: [0, 1.8, -30], type: 'target_board', scale: 1.0 }
        ]
    },
    {
        id: 5,
        title: "Party Balloons",
        targetType: "balloons",
        icon: "🎈",
        description: "Pop 8 colorful floating balloons bobbing in the breeze!",
        distance: 25,
        arrows: 7,
        wind: { min: 0.5, max: 2.0 },
        passScore: 5,
        stars: { one: 5, two: 7, three: 8 },
        targets: [
            { pos: [-2.0, 1.2, -25], type: 'balloon', color: 0xFF1744, floatSpeed: 1.2 },
            { pos: [-1.2, 1.8, -25], type: 'balloon', color: 0x00E676, floatSpeed: 1.6 },
            { pos: [-0.5, 1.0, -25], type: 'balloon', color: 0xFFEA00, floatSpeed: 1.4 },
            { pos: [0.2, 2.0, -25], type: 'balloon', color: 0x2979FF, floatSpeed: 1.8 },
            { pos: [0.9, 1.4, -25], type: 'balloon', color: 0xD500F9, floatSpeed: 1.5 },
            { pos: [1.6, 1.1, -25], type: 'balloon', color: 0xFF9100, floatSpeed: 2.0 },
            { pos: [-0.8, 2.3, -25], type: 'balloon', color: 0x00E5FF, floatSpeed: 1.3 },
            { pos: [1.1, 2.2, -25], type: 'balloon', color: 0xFF3D00, floatSpeed: 1.7 }
        ]
    },
    {
        id: 6,
        title: "Rotating Wheel Target",
        targetType: "rotating_wheel",
        icon: "🎡",
        description: "Hit the spinning archery wheel target as it rotates!",
        distance: 30,
        arrows: 5,
        wind: { min: 1.0, max: 2.5 },
        passScore: 40,
        stars: { one: 40, two: 45, three: 50 },
        targets: [
            { pos: [0, 2.0, -30], type: 'rotating_wheel', rotateSpeed: 1.2 }
        ]
    },
    {
        id: 7,
        title: "Windy Crossbreeze",
        targetType: "target_board",
        icon: "🌬️",
        description: "Distant target with strong sideways wind drift! Compensate your aim!",
        distance: 35,
        arrows: 5,
        wind: { min: 3.5, max: 6.0 },
        passScore: 30,
        stars: { one: 30, two: 40, three: 46 },
        targets: [
            { pos: [0, 1.8, -35], type: 'target_board', scale: 1.0 }
        ]
    },
    {
        id: 8,
        title: "Moving Rails Challenge",
        targetType: "moving_rails",
        icon: "🚂",
        description: "Targets sliding back and forth on motorized track rails!",
        distance: 30,
        arrows: 6,
        wind: { min: 2.0, max: 4.0 },
        passScore: 4,
        stars: { one: 4, two: 5, three: 6 },
        targets: [
            { pos: [-1.0, 1.5, -30], type: 'football', railDist: 2.5, railSpeed: 1.5 },
            { pos: [0.0, 1.8, -30], type: 'bottle', railDist: 3.0, railSpeed: 2.0 },
            { pos: [1.0, 1.3, -30], type: 'apple', railDist: 2.0, railSpeed: 1.8 }
        ]
    },
    {
        id: 9,
        title: "Multi-Object Mayhem",
        targetType: "multi_object",
        icon: "💥",
        description: "Mix of bottles, apples, footballs and balloons at varying ranges!",
        distance: 32,
        arrows: 7,
        wind: { min: 2.5, max: 5.0 },
        passScore: 5,
        stars: { one: 5, two: 6, three: 7 },
        targets: [
            { pos: [-2.0, 1.2, -22], type: 'bottle' },
            { pos: [-1.0, 1.6, -28], type: 'apple' },
            { pos: [0.0, 1.8, -35], type: 'target_board', scale: 0.9 },
            { pos: [1.2, 1.4, -25], type: 'football', bounceSpeed: 2.0, bounceAmp: 0.7 },
            { pos: [2.2, 2.1, -30], type: 'balloon', color: 0xFF1744, floatSpeed: 1.5 },
            { pos: [-0.5, 2.2, -32], type: 'balloon', color: 0x00E676, floatSpeed: 1.8 }
        ]
    },
    {
        id: 10,
        title: "Master Boss Archery",
        targetType: "boss_challenge",
        icon: "👑",
        description: "Dynamic moving boss target with shifting wind gusts! Ultimate test!",
        distance: 40,
        arrows: 6,
        wind: { min: 4.0, max: 8.5 },
        passScore: 60,
        stars: { one: 60, two: 75, three: 90 },
        targets: [
            { pos: [0, 2.2, -40], type: 'boss_target', moveSpeed: 1.8, moveAmp: 3.5 }
        ]
    }
];

window.LEVELS = LEVELS;

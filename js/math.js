function MathHelper() {
}

// Проверяем, что position входит в круг с центром в circlePosition и радиусом circleRadius,
// используя теорему Пифагора
MathHelper.prototype.checkPositionIsInCircle = function (position, circlePosition, circleRadius) {
    if (![position, circlePosition].every(function (position) {
            return position instanceof Position;
        })) {
        throw new TypeError('Invalid positions');
    }

    return Math.pow(position.getX() - circlePosition.getX(), 2)
        + Math.pow(position.getY() - circlePosition.getY(), 2)
        <= Math.pow(circleRadius, 2);
};


// t — шаг на котором мы считаем положение кривой, p0, p1, p2 - опорные точки
// Теория: https://ru.wikipedia.org/wiki/%D0%9A%D1%80%D0%B8%D0%B2%D0%B0%D1%8F_%D0%91%D0%B5%D0%B7%D1%8C%D0%B5#.D0.9A.D0.B2.D0.B0.D0.B4.D1.80.D0.B0.D1.82.D0.B8.D1.87.D0.BD.D1.8B.D0.B5_.D0.BA.D1.80.D0.B8.D0.B2.D1.8B.D0.B5
MathHelper.prototype.getQuadraticCurveCoord = function (t, p0, p1, p2) {
    if (t < 0 || t > 1) {
        throw new Error('Parameter t must be in range from 0 to 1');
    }
    return Math.pow(1 - t, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
};

// Посчитать координаты, деляющие прямой отрезок в отношении ratio
MathHelper.prototype.getPositionDividedInRatio = function (ratio, fromPosition, toPosition) {
    return new Position(
        (fromPosition.getX() + (ratio * toPosition.getX())) / (1 + ratio),
        (fromPosition.getY() + (ratio * toPosition.getY())) / (1 + ratio)
    );
};


import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Income vs Expense Line Chart using pure React Native SVG
 */
export function IncomeExpenseLineChart({
  incomeData = [45000, 52000, 68000, 75000, 89000, 95000],
  expenseData = [28000, 31000, 42000, 39000, 48000, 41650],
  labels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  height = 190,
}) {
  const chartWidth = Math.min(SCREEN_WIDTH - 64, 380);
  const chartHeight = height;
  const paddingLeft = 38;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...incomeData, ...expenseData, 100000) * 1.1;

  const getX = (index) => paddingLeft + (index / (labels.length - 1)) * innerWidth;
  const getY = (val) => paddingTop + innerHeight - (val / maxVal) * innerHeight;

  // Generate SVG path for a line
  const makePath = (data) => {
    return data.reduce((path, val, idx) => {
      const x = getX(idx);
      const y = getY(val);
      if (idx === 0) return `M ${x} ${y}`;
      // Smooth cubic bezier
      const prevX = getX(idx - 1);
      const prevY = getY(data[idx - 1]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpX2 = prevX + (x - prevX) / 2;
      return `${path} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
    }, '');
  };

  const incomePath = makePath(incomeData);
  const expensePath = makePath(expenseData);

  // Grid lines
  const gridLevels = [0, 0.33, 0.66, 1];

  return (
    <View style={styles.chartWrapper}>
      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.mintGreenDark }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.expenseRed }]} />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>

      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.mintGreen} stopOpacity="0.4" />
            <Stop offset="1" stopColor={colors.mintGreen} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Horizontal Grid lines */}
        {gridLevels.map((lvl, i) => {
          const y = paddingTop + innerHeight * (1 - lvl);
          const valueLabel = Math.round((maxVal * lvl) / 1000) + 'k';
          return (
            <G key={`grid-${i}`}>
              <Line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke={colors.borderSubtle}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <SvgText
                x={paddingLeft - 8}
                y={y + 3}
                fontSize={9}
                fill={colors.textSecondary}
                textAnchor="end"
              >
                ₹{valueLabel}
              </SvgText>
            </G>
          );
        })}

        {/* Income Line */}
        <Path
          d={incomePath}
          fill="none"
          stroke={colors.mintGreenDark}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Expense Line */}
        <Path
          d={expensePath}
          fill="none"
          stroke={colors.expenseRed}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Dots & Labels */}
        {labels.map((lbl, idx) => {
          const x = getX(idx);
          const incY = getY(incomeData[idx]);
          const expY = getY(expenseData[idx]);

          return (
            <G key={`pts-${idx}`}>
              {/* Income Dot */}
              <Circle cx={x} cy={incY} r={4} fill={colors.cardWhite} stroke={colors.mintGreenDark} strokeWidth={2.5} />
              {/* Expense Dot */}
              <Circle cx={x} cy={expY} r={4} fill={colors.cardWhite} stroke={colors.expenseRed} strokeWidth={2.5} />
              {/* X Axis Label */}
              <SvgText
                x={x}
                y={chartHeight - 8}
                fontSize={10}
                fill={colors.textSecondary}
                textAnchor="middle"
                fontWeight="500"
              >
                {lbl}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

/**
 * Spending Breakdown Donut Chart
 */
export function SpendingDonutChart({
  data = [
    { name: 'Food & Dining', amount: 7300, color: '#FF5C8D' },
    { name: 'Shopping', amount: 6200, color: '#6C63FF' },
    { name: 'Health', amount: 3800, color: '#43A047' },
    { name: 'Bills', amount: 3200, color: '#FB8C00' },
    { name: 'Education', amount: 2999, color: '#5E35B1' },
    { name: 'Others', amount: 3250, color: '#039BE5' },
  ],
  totalSpent = 26749,
}) {
  const size = 180;
  const strokeWidth = 22;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((sum, item) => sum + item.amount, 0) || 1;

  let currentAngle = -90; // Start at top

  // Calculate stroke dash offsets
  const slices = data.map((item) => {
    const fraction = item.amount / total;
    const strokeDashoffset = circumference * (1 - fraction);
    const rotation = currentAngle;
    currentAngle += fraction * 360;

    return {
      ...item,
      fraction,
      strokeDashoffset,
      rotation,
    };
  });

  return (
    <View style={styles.donutContainer}>
      <View style={styles.donutSvgWrapper}>
        <Svg width={size} height={size}>
          {/* Base track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.surfaceMuted}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {slices.map((slice, index) => {
            const strokeDasharray = `${circumference * slice.fraction} ${circumference * (1 - slice.fraction)}`;
            return (
              <Circle
                key={`donut-slice-${index}`}
                cx={center}
                cy={center}
                r={radius}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={0}
                fill="none"
                transform={`rotate(${slice.rotation}, ${center}, ${center})`}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>

        {/* Center Text inside Donut */}
        <View style={styles.donutCenterContent}>
          <Text style={styles.centerSmallLabel}>TOTAL SPENT</Text>
          <Text style={styles.centerAmount}>${Math.round(totalSpent || 0).toLocaleString()}</Text>
        </View>
      </View>

      {/* Donut Legend */}
      <View style={styles.donutLegendGrid}>
        {data.map((item, index) => {
          const pct = Math.round((item.amount / total) * 100);
          return (
            <View key={`d-leg-${index}`} style={styles.donutLegendItem}>
              <View style={[styles.donutLegendDot, { backgroundColor: item.color }]} />
              <View style={styles.legendTextWrap}>
                <Text style={styles.donutItemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.donutItemValue}>
                  ${(item?.amount || 0).toLocaleString()} ({pct || 0}%)
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...spacing.shadowSubtle,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  donutContainer: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...spacing.shadowSubtle,
  },
  donutSvgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: spacing.sm,
  },
  donutCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSmallLabel: {
    ...typography.badge,
    fontSize: 9,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  centerAmount: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.primaryNavy,
    marginTop: 2,
  },
  donutLegendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.md,
  },
  donutLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.sm,
  },
  donutLegendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 6,
  },
  legendTextWrap: {
    flex: 1,
  },
  donutItemName: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  donutItemValue: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
});

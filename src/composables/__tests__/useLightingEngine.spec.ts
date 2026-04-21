import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useLightingEngine, getFusedMaskStyle } from '../useLightingEngine';
import { LightingPhase } from '../../types';

// Task 2.2: Define TS Types/Mocks for LightingConfig contexts
export interface MockLightingState {
	phase: LightingPhase;
	position: { x: number; y: number };
	isFlashActive: boolean;
}

describe('Lighting Engine tests', () => {
	beforeEach(() => {
		// Mock the document.documentElement.style.setProperty to avoid DOM errors in Node tests
		document.documentElement.style.setProperty = vi.fn();
	});

	test('Initializes with default state values', () => {
		const { state } = useLightingEngine();
		expect(state).toHaveProperty('phase');
		expect(state.phase).toBe(LightingPhase.NAV);
		expect(state.isFlashActive).toBe(false);
	});

	test('getFusedMaskStyle generates correct viewport-relative mask positions', () => {
		const numericResult = getFusedMaskStyle(150, 300);
		// Should include -50vw and -50vh offsets for centering
		expect(numericResult.maskPosition).toContain('var(--mask-x)');
		expect(numericResult.maskPosition).toContain('150px');
		expect(numericResult.maskPosition).toContain('50vw');
		
		expect(numericResult.maskSize).toBe('100vw 100vh');
	});

	test('getFusedMaskStyle evaluates string-based CSS variables directly', () => {
		const cssVarResult = getFusedMaskStyle('var(--el-left)', 'var(--el-top)');
		expect(cssVarResult.maskPosition).toContain('var(--el-left)');
		expect(cssVarResult.maskPosition).toContain('50vw');
	});
});

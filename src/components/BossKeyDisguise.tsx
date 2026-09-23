/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Table, FileText, Code2, EyeOff, ShieldCheck } from 'lucide-react';

interface BossKeyDisguiseProps {
  onDismiss: () => void;
}

type DisguiseType = 'spreadsheet' | 'academic' | 'editor';

export const BossKeyDisguise: React.FC<BossKeyDisguiseProps> = ({ onDismiss }) => {
  const [activeType, setActiveType] = useState<DisguiseType>('spreadsheet');

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-800 font-sans select-none overflow-auto">
      {/* Discreet Quick Switcher Bar (Hover-friendly in top right) */}
      <div className="fixed top-2 right-4 z-50 flex items-center gap-1.5 bg-slate-900/90 text-white px-2.5 py-1 rounded shadow-lg backdrop-blur text-xs opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-slate-400 mr-1">Camouflage:</span>
        <button
          type="button"
          onClick={() => setActiveType('spreadsheet')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded ${activeType === 'spreadsheet' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}`}
          title="Switch to Excel / Google Sheets"
        >
          <Table className="w-3 h-3" /> Sheets
        </button>
        <button
          type="button"
          onClick={() => setActiveType('academic')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded ${activeType === 'academic' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
          title="Switch to Academic Research Paper"
        >
          <FileText className="w-3 h-3" /> Paper
        </button>
        <button
          type="button"
          onClick={() => setActiveType('editor')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded ${activeType === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
          title="Switch to Code Editor"
        >
          <Code2 className="w-3 h-3" /> IDE
        </button>
        <div className="h-3 w-px bg-slate-700 mx-1" />
        <button
          type="button"
          onClick={onDismiss}
          className="flex items-center gap-1 text-emerald-300 hover:text-emerald-100 font-medium ml-1"
          title="Press Esc or click to return to Sector Sweeper"
        >
          <EyeOff className="w-3 h-3" /> Exit [Esc]
        </button>
      </div>

      {/* DISGUISE 1: SPREADSHEET (Excel / Sheets) */}
      {activeType === 'spreadsheet' && (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-xs text-slate-800">
          {/* Top Bar */}
          <div className="bg-emerald-800 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-700 rounded flex items-center justify-center font-bold text-sm">
                X
              </div>
              <div>
                <div className="font-semibold text-sm leading-tight flex items-center gap-2">
                  <span>FY2026_Q3_Operational_Expenses_Consolidated.xlsx</span>
                  <span className="text-emerald-200 text-[10px] font-normal border border-emerald-600 px-1 rounded">Saved to Cloud</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-emerald-200 mt-0.5">
                  <span className="cursor-pointer hover:underline">File</span>
                  <span className="cursor-pointer hover:underline">Edit</span>
                  <span className="cursor-pointer hover:underline">View</span>
                  <span className="cursor-pointer hover:underline">Insert</span>
                  <span className="cursor-pointer hover:underline">Format</span>
                  <span className="cursor-pointer hover:underline">Data</span>
                  <span className="cursor-pointer hover:underline">Tools</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-100"><ShieldCheck className="w-3.5 h-3.5" /> Read-Only Mode</span>
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center font-semibold text-white">
                JD
              </div>
            </div>
          </div>

          {/* Formula Bar */}
          <div className="bg-white border-b border-slate-300 px-3 py-1 flex items-center gap-2 text-xs">
            <span className="font-mono font-semibold text-slate-500 w-10 text-center bg-slate-100 border border-slate-300 py-0.5 rounded">
              D14
            </span>
            <span className="font-serif italic text-slate-400 font-bold">fx</span>
            <input
              type="text"
              readOnly
              value="=SUMIFS('CostCenters'!G$4:G$88, 'CostCenters'!B$4:B$88, A14, 'CostCenters'!E$4:E$88, &quot;Active&quot;)"
              className="flex-1 bg-transparent border-none outline-none font-mono text-slate-700 text-xs px-2 py-0.5"
            />
          </div>

          {/* Spreadsheet Table */}
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-300 font-semibold text-center">
                  <th className="w-10 border-r border-slate-300 py-1 bg-slate-200">#</th>
                  <th className="w-28 border-r border-slate-300 py-1">A (Cost Center)</th>
                  <th className="border-r border-slate-300 py-1">B (Department)</th>
                  <th className="w-36 border-r border-slate-300 py-1">C (Category)</th>
                  <th className="w-32 border-r border-slate-300 py-1">D (Q1 Actual)</th>
                  <th className="w-32 border-r border-slate-300 py-1">E (Q2 Actual)</th>
                  <th className="w-32 border-r border-slate-300 py-1">F (Q3 Forecast)</th>
                  <th className="w-28 border-r border-slate-300 py-1">G (Variance %)</th>
                  <th className="w-24 py-1">H (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  ['1010-US', 'Platform Engineering', 'Compute & Kubernetes Clusters', '$142,390.00', '$138,500.00', '$144,200.00', '+1.2%', 'On Track'],
                  ['1020-US', 'Platform Engineering', 'Observability & APM Ingestion', '$34,120.00', '$36,800.00', '$35,000.00', '-4.8%', 'Review'],
                  ['1030-EU', 'Core Infrastructure', 'Relational DB Replication (Multi-AZ)', '$89,450.00', '$91,200.00', '$90,000.00', '-1.3%', 'On Track'],
                  ['1040-AP', 'Database Reliability', 'Object Storage (Cold Tier / Glaciers)', '$22,890.00', '$23,100.00', '$24,500.00', '+6.0%', 'Approved'],
                  ['2010-GL', 'Information Security', 'Zero-Trust Gateways & Edge WAF', '$48,000.00', '$48,000.00', '$48,000.00', '0.0%', 'Locked'],
                  ['2020-GL', 'Corporate Compliance', 'SOC2 / ISO27001 Annual Auditing', '$65,000.00', '$0.00', '$65,000.00', '0.0%', 'Planned'],
                  ['3010-US', 'Product Strategy', 'Developer Tooling Subscriptions', '$19,430.00', '$20,100.00', '$21,000.00', '+4.4%', 'On Track'],
                  ['3020-US', 'Applied Science', 'Vector Indexing & Inference Compute', '$112,000.00', '$126,400.00', '$135,000.00', '+6.8%', 'Budget Cap'],
                  ['4010-GL', 'Quality Assurance', 'Hermetic Testing Sandboxes', '$27,800.00', '$28,200.00', '$28,000.00', '-0.7%', 'On Track'],
                  ['4020-GL', 'Release Engineering', 'Artifact Registry & CDN Bandwidth', '$43,150.00', '$44,000.00', '$45,200.00', '+2.7%', 'On Track'],
                  ['5010-US', 'Human Resources', 'Technical Upskilling & Certifications', '$15,000.00', '$12,500.00', '$14,000.00', '+12.0%', 'Approved'],
                  ['5020-GL', 'Facilities & Assets', 'Workstation Hardware Refresh', '$84,000.00', '$42,000.00', '$38,000.00', '-9.5%', 'Complete'],
                  ['6010-US', 'General & Admin', 'Legal & Regulatory Advisory', '$32,000.00', '$35,000.00', '$30,000.00', '-14.2%', 'On Track'],
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                    <td className="text-center font-mono text-slate-400 bg-slate-100/70 border-r border-slate-300 py-1">
                      {idx + 1}
                    </td>
                    <td className="px-2 font-mono text-slate-600 border-r border-slate-200">{row[0]}</td>
                    <td className="px-2 font-medium text-slate-800 border-r border-slate-200">{row[1]}</td>
                    <td className="px-2 text-slate-700 border-r border-slate-200">{row[2]}</td>
                    <td className="px-2 text-right font-mono text-slate-700 border-r border-slate-200">{row[3]}</td>
                    <td className="px-2 text-right font-mono text-slate-700 border-r border-slate-200">{row[4]}</td>
                    <td className="px-2 text-right font-mono font-semibold text-slate-900 border-r border-slate-200">{row[5]}</td>
                    <td className={`px-2 text-right font-mono ${row[6].startsWith('+') ? 'text-amber-700 font-medium' : 'text-slate-600'} border-r border-slate-200`}>
                      {row[6]}
                    </td>
                    <td className="px-2 text-center text-[11px]">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">
                        {row[7]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Tabs */}
          <div className="bg-slate-200 border-t border-slate-300 px-3 py-1 flex items-center gap-1 text-xs">
            <div className="bg-white text-emerald-800 font-semibold px-3 py-1 border-t-2 border-emerald-600 rounded-t shadow-sm">
              Consolidated_Summary
            </div>
            <div className="text-slate-600 hover:bg-slate-300 px-3 py-1 rounded-t cursor-pointer">
              Compute_Allocations
            </div>
            <div className="text-slate-600 hover:bg-slate-300 px-3 py-1 rounded-t cursor-pointer">
              Storage_Tiers
            </div>
            <div className="text-slate-600 hover:bg-slate-300 px-3 py-1 rounded-t cursor-pointer">
              Variance_Audit_Trail
            </div>
          </div>
        </div>
      )}

      {/* DISGUISE 2: ACADEMIC RESEARCH PAPER */}
      {activeType === 'academic' && (
        <div className="min-h-screen bg-neutral-100 p-8 flex justify-center text-neutral-900 font-serif">
          <div className="max-w-4xl bg-white shadow-md p-12 border border-neutral-300 leading-relaxed text-sm">
            <div className="text-center border-b border-neutral-300 pb-6 mb-8">
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                ACM Transactions on Database Systems, Vol. 48, No. 3, Article 114
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-950 mb-3 font-serif">
                A Formal Calculus for Relational Integrity Invariants Under High-Throughput Distributed Mutation
              </h1>
              <p className="text-xs text-neutral-600">
                Dr. Alan M. Vance, Dept. of Computer Science & Engineering · Technical University of Berlin
              </p>
            </div>

            <div className="mb-6 bg-neutral-50 p-4 border-l-4 border-neutral-400 text-xs italic text-neutral-700">
              <strong>Abstract:</strong> Modern distributed transaction processing engines balance linearizable isolation against latency overheads. We formalize an invariant verification protocol based on monotonic dependency lattices. By establishing deterministic adjacency criteria across partitioned topological indexes, we prove that consistency hazards are bounded in $O(\log N)$ network propagation cycles.
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs text-justify">
              <div>
                <h2 className="font-bold uppercase tracking-wider text-xs border-b border-neutral-200 pb-1 mb-2 font-sans">
                  1. Introduction & Background
                </h2>
                <p className="mb-3">
                  Relational consistency models traditionally enforce foreign key referential integrity through global distributed locks or distributed 2PC protocols. However, in low-latency partitioned nodes, synchronization locks introduce catastrophic tail latency spikes under burst workloads.
                </p>
                <p className="mb-3">
                  Consider a database relation R partitioned across k autonomous nodes. When transaction T_i introduces a state mutation S_t → S_(t+1), verifying invariant I(R) requires bounded observation over adjacent tuple projections:
                </p>
                <div className="my-3 p-2 bg-neutral-50 border border-neutral-200 font-mono text-[11px] text-center text-neutral-800">
                  ∀ c ∈ Domain(R),  ∑ [n ∈ N(c)] ω(n) ≤ θ_threshold
                </div>
                <p>
                  As demonstrated in Theorem 3.2, by treating localized clustered constraints as topological graph boundaries, adjacent queries can deduce conflict likelihood deterministically without global synchronization rounds.
                </p>
              </div>

              <div>
                <h2 className="font-bold uppercase tracking-wider text-xs border-b border-neutral-200 pb-1 mb-2 font-sans">
                  2. Formal Correctness Bounds
                </h2>
                <p className="mb-3">
                  We state the primary non-interference condition. Let $\Gamma$ represent the set of active concurrent sweeps across partition boundaries:
                </p>
                <ul className="list-disc pl-4 space-y-1 mb-3">
                  <li><strong>Lemma 2.1:</strong> Monotonicity guarantees that safe regions never transition to hazardous states without explicit log entries.</li>
                  <li><strong>Lemma 2.2:</strong> An unobserved cluster of degree $d \ge 2$ requires at most $\lceil d / 2 \rceil$ verification probes to preserve serializability.</li>
                </ul>
                <p className="mb-3">
                  Empirical benchmarks conducted across 128 multi-region shards indicate a 73.4% reduction in barrier contention compared to standard distributed two-phase locking.
                </p>
                <h2 className="font-bold uppercase tracking-wider text-xs border-b border-neutral-200 pb-1 mb-2 mt-4 font-sans">
                  References
                </h2>
                <ol className="list-decimal pl-4 text-[10px] text-neutral-500 space-y-1">
                  <li>Bernstein, P. A., & Goodman, N. (1981). Concurrency control in distributed database systems. ACM Computing Surveys, 13(2), 185-221.</li>
                  <li>Lamport, L. (1978). Time, clocks, and the ordering of events in a distributed system. CACM, 21(7), 558-565.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISGUISE 3: VS CODE / CODE EDITOR */}
      {activeType === 'editor' && (
        <div className="min-h-screen bg-[#1e1e1e] text-slate-300 font-mono text-xs flex flex-col">
          {/* Editor Header Bar */}
          <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between text-slate-400 border-b border-[#3e3e3e]">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">TS</span>
              <span className="text-white text-xs">sector_allocator.service.ts — workspace-backend</span>
            </div>
            <div className="text-[11px] text-slate-500">
              LF · UTF-8 · TypeScript 5.4 · Prettier
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* File Explorer Sidebar */}
            <div className="w-56 bg-[#252526] border-r border-[#333] p-3 text-slate-400 select-none hidden md:block">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 font-bold">Explorer: Backend</div>
              <div className="space-y-1 text-xs">
                <div className="text-slate-300 font-medium">▸ src/controllers</div>
                <div className="text-slate-300 font-medium">▾ src/services</div>
                <div className="pl-3 text-blue-300 bg-[#37373d] py-0.5 rounded px-1">sector_allocator.service.ts</div>
                <div className="pl-3 text-slate-400 hover:text-slate-200">database_pool.ts</div>
                <div className="pl-3 text-slate-400 hover:text-slate-200">telemetry_daemon.ts</div>
                <div className="text-slate-300 font-medium mt-2">▸ src/types</div>
                <div className="pl-3 text-slate-400">config.json</div>
                <div className="pl-3 text-slate-400">package.json</div>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed bg-[#1e1e1e]">
              <pre className="text-slate-300">
                <code>{`import { Injectable, Logger } from '@nestjs/common';
import { DatabasePool } from '../database/pool.provider';
import { PartitionMetrics, InvariantCheckResult } from '../types/cluster';

@Injectable()
export class SectorAllocatorService {
  private readonly logger = new Logger(SectorAllocatorService.name);
  private static readonly MAX_SAFE_ADJACENCY = 8;

  constructor(private readonly pool: DatabasePool) {}

  /**
   * Scans partitioned memory clusters to verify data cell integrity.
   * Ensures non-blocking read replicas conform to topology boundaries.
   */
  public async auditSectorTopology(
    sectorId: string,
    clusterDimensions: { rows: number; cols: number }
  ): Promise<InvariantCheckResult> {
    const timestamp = performance.now();
    this.logger.log(\`Initializing non-destructive audit on sector \${sectorId}\`);

    const client = await this.pool.acquireClient();
    try {
      const records = await client.query(
        \`SELECT cell_id, adjacency_weight, flag_status 
         FROM memory_partitions 
         WHERE sector_id = $1 AND is_corrupted = false\`,
        [sectorId]
      );

      let anomalyCount = 0;
      for (const cell of records.rows) {
        if (cell.adjacency_weight > SectorAllocatorService.MAX_SAFE_ADJACENCY) {
          anomalyCount++;
          this.logger.warn(\`Cell \${cell.cell_id} exceeds expected constraint envelope\`);
        }
      }

      return {
        healthy: anomalyCount === 0,
        scannedCount: records.rowCount,
        executionTimeMs: Math.round(performance.now() - timestamp),
        verifiedAt: new Date().toISOString()
      };
    } finally {
      client.release();
    }
  }
}
`}</code>
              </pre>
            </div>
          </div>

          {/* Integrated Terminal */}
          <div className="h-28 bg-[#181818] border-t border-[#333] p-2 font-mono text-[11px] text-slate-400 overflow-auto">
            <div className="text-slate-500 mb-1 flex items-center gap-4">
              <span className="text-white font-bold">TERMINAL</span>
              <span>OUTPUT</span>
              <span>DEBUG CONSOLE</span>
              <span>PROBLEMS (0)</span>
            </div>
            <div className="text-emerald-400">✓ Test Suite [SectorAllocator]: 14 passed, 0 failed (3.42s)</div>
            <div className="text-slate-400">$ pnpm run lint:check</div>
            <div className="text-slate-500">Checking 48 files across src/... No issues found.</div>
            <div className="text-slate-300">$ _</div>
          </div>
        </div>
      )}
    </div>
  );
};

/** A single TGV regularity record returned by the API. */
export interface TGVData {
  /** MongoDB document identifier (serialised as a string). */
  _id: string;
  /** Month of the record in YYYY-MM format. */
  date: string;
  /** TGV network region (e.g. "Atlantique", "Nord"). */
  region: string;
  /** Name of the departure station. */
  depart: string;
  /** Name of the arrival station. */
  arrivee: string;
  /** Number of trains originally scheduled. */
  trains_prevus: number;
  /** Number of trains that actually ran. */
  trains_realises: number;
  /** Number of trains cancelled. */
  trains_annules: number;
  /** Number of delayed trains. */
  retards: number;
  /** On-time rate as a percentage (0–100). */
  ponctualite: number;
  /** ISO-8601 UTC timestamp of when the record was created. */
  timestamp: string;
}

/** Global statistics returned by GET /api/stats. */
export interface TGVStats {
  /** Total number of documents in the collection. */
  total_documents: number;
  /** Per-region document counts. */
  regions: Array<{
    _id: string;
    count: number;
  }>;
  /** Average punctuality across all records (percentage). */
  ponctualite_moyenne: number;
  /** ISO-8601 timestamp of the most-recently inserted record, or null. */
  dernier_envoi: string | null;
}

/** Generic API envelope used by paginated and single-resource endpoints. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  stats?: TGVStats;
  error?: string;
}

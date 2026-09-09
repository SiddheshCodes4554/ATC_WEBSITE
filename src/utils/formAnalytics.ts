import Papa from 'papaparse';
import {
  CustomForm,
  CustomFormResponse,
  FormFieldDefinition,
  TimeRangeOption,
  FormAnalyticsSummary,
  ResponseTrendPoint,
  FieldAnalytics,
  ChoiceDistribution,
  RatingDistribution,
} from '../types/customForm.types';

/**
 * ============================================================================
 * ATC Form Analytics & CSV Export Utility
 * ============================================================================
 */

/**
 * Filters responses based on a selected time range
 */
export function filterResponsesByTimeRange(
  responses: CustomFormResponse[],
  range: TimeRangeOption
): CustomFormResponse[] {
  if (!responses || responses.length === 0 || range === 'all') {
    return responses || [];
  }

  const now = new Date();
  let cutoffTimestamp: number;

  switch (range) {
    case 'today': {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      cutoffTimestamp = startOfDay.getTime();
      break;
    }
    case '7d': {
      cutoffTimestamp = now.getTime() - 7 * 24 * 60 * 60 * 1000;
      break;
    }
    case '30d': {
      cutoffTimestamp = now.getTime() - 30 * 24 * 60 * 60 * 1000;
      break;
    }
    default:
      return responses;
  }

  return responses.filter((r) => {
    const time = new Date(r.submittedAt || r.createdAt).getTime();
    return !isNaN(time) && time >= cutoffTimestamp;
  });
}

/**
 * Calculates top-level summary metrics
 */
export function calculateAnalyticsSummary(
  responses: CustomFormResponse[],
  form: CustomForm
): FormAnalyticsSummary {
  const totalResponses = responses.length;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  let todayCount = 0;
  let weekCount = 0;
  let identifiedCount = 0;
  let anonymousCount = 0;

  // Rating aggregation
  const ratingFields = (form.fields || []).filter((f) => f.type === 'rating');
  let ratingSum = 0;
  let totalRatingResponses = 0;

  for (const resp of responses) {
    const time = new Date(resp.submittedAt || resp.createdAt).getTime();
    if (!isNaN(time)) {
      if (time >= startOfToday) todayCount++;
      if (time >= startOfWeek) weekCount++;
    }

    if (resp.respondentEmail || resp.userId) {
      identifiedCount++;
    } else {
      anonymousCount++;
    }

    // Accumulate rating scores
    if (ratingFields.length > 0 && resp.answers) {
      for (const rf of ratingFields) {
        const val = Number(resp.answers[rf.id]);
        if (!isNaN(val) && val > 0) {
          ratingSum += val;
          totalRatingResponses++;
        }
      }
    }
  }

  const averageRating =
    totalRatingResponses > 0
      ? Number((ratingSum / totalRatingResponses).toFixed(1))
      : undefined;

  return {
    totalResponses,
    todayCount,
    weekCount,
    identifiedCount,
    anonymousCount,
    averageRating,
    totalRatingResponses: totalRatingResponses > 0 ? totalRatingResponses : undefined,
  };
}

/**
 * Calculates submission volume trend points for visualization
 */
export function calculateResponseTrend(
  responses: CustomFormResponse[],
  range: TimeRangeOption
): ResponseTrendPoint[] {
  if (!responses || responses.length === 0) {
    return [];
  }

  // Range-specific bucket generation
  const now = new Date();

  if (range === 'today') {
    // Generate 8 3-hour interval buckets for today (00:00 to 21:00)
    const buckets: Record<string, number> = {};
    const labels: string[] = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    labels.forEach((l) => (buckets[l] = 0));

    const todayStr = now.toISOString().slice(0, 10);

    for (const resp of responses) {
      const d = new Date(resp.submittedAt || resp.createdAt);
      if (d.toISOString().slice(0, 10) === todayStr) {
        const hour = d.getHours();
        const bucketIndex = Math.min(7, Math.floor(hour / 3));
        const bucketLabel = labels[bucketIndex];
        buckets[bucketLabel] = (buckets[bucketLabel] || 0) + 1;
      }
    }

    return labels.map((label) => ({
      label,
      rawDate: label,
      count: buckets[label] || 0,
    }));
  }

  // Daily bucket generation (7d, 30d, or all)
  const dayCount = range === '7d' ? 7 : range === '30d' ? 30 : 14;
  const dayBuckets: Record<string, { label: string; count: number; rawDate: string }> = {};

  // Pre-populate past N days
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    dayBuckets[dateKey] = { label, count: 0, rawDate: dateKey };
  }

  // Fill counts
  for (const resp of responses) {
    const d = new Date(resp.submittedAt || resp.createdAt);
    if (!isNaN(d.getTime())) {
      const dateKey = d.toISOString().slice(0, 10);
      if (dayBuckets[dateKey]) {
        dayBuckets[dateKey].count++;
      } else if (range === 'all') {
        // If range is all, include earlier dates
        const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        dayBuckets[dateKey] = {
          label,
          count: 1,
          rawDate: dateKey,
        };
      }
    }
  }

  // Sort chronologically
  return Object.keys(dayBuckets)
    .sort()
    .map((k) => ({
      label: dayBuckets[k].label,
      rawDate: dayBuckets[k].rawDate,
      count: dayBuckets[k].count,
    }));
}

/**
 * Calculates question-specific choice, rating, and response distributions
 */
export function calculateFieldAnalytics(
  field: FormFieldDefinition,
  responses: CustomFormResponse[]
): FieldAnalytics {
  const totalResponsesCount = responses.length;
  let totalAnswers = 0;

  // 1. Radio / Select Single Choice Distribution
  if (field.type === 'radio' || field.type === 'select') {
    const counts: Record<string, number> = {};
    const configuredOptions = field.options || [];
    configuredOptions.forEach((opt) => (counts[opt] = 0));

    for (const resp of responses) {
      const val = resp.answers?.[field.id];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const optionKey = String(val);
        counts[optionKey] = (counts[optionKey] || 0) + 1;
        totalAnswers++;
      }
    }

    const choices: ChoiceDistribution[] = Object.keys(counts).map((option) => ({
      option,
      count: counts[option],
      percentage: totalAnswers > 0 ? Math.round((counts[option] / totalAnswers) * 100) : 0,
    }));

    // Sort by count descending
    choices.sort((a, b) => b.count - a.count);

    return {
      fieldId: field.id,
      fieldLabel: field.label,
      fieldType: field.type,
      totalAnswers,
      completionRate:
        totalResponsesCount > 0
          ? Number(((totalAnswers / totalResponsesCount) * 100).toFixed(1))
          : 0,
      choices,
    };
  }

  // 2. Checkbox Multiple Choice Distribution
  if (field.type === 'checkbox') {
    const counts: Record<string, number> = {};
    const configuredOptions = field.options || [];
    configuredOptions.forEach((opt) => (counts[opt] = 0));

    for (const resp of responses) {
      const val = resp.answers?.[field.id];
      if (Array.isArray(val) && val.length > 0) {
        totalAnswers++;
        val.forEach((item) => {
          const itemKey = String(item);
          counts[itemKey] = (counts[itemKey] || 0) + 1;
        });
      }
    }

    const choices: ChoiceDistribution[] = Object.keys(counts).map((option) => ({
      option,
      count: counts[option],
      percentage: totalAnswers > 0 ? Math.round((counts[option] / totalAnswers) * 100) : 0,
    }));

    choices.sort((a, b) => b.count - a.count);

    return {
      fieldId: field.id,
      fieldLabel: field.label,
      fieldType: field.type,
      totalAnswers,
      completionRate:
        totalResponsesCount > 0
          ? Number(((totalAnswers / totalResponsesCount) * 100).toFixed(1))
          : 0,
      choices,
    };
  }

  // 3. Rating Score Distribution
  if (field.type === 'rating') {
    const minR = field.minRating ?? 1;
    const maxR = field.maxRating ?? 5;
    const scoreCounts: Record<number, number> = {};

    for (let r = minR; r <= maxR; r++) {
      scoreCounts[r] = 0;
    }

    let scoreSum = 0;

    for (const resp of responses) {
      const val = resp.answers?.[field.id];
      const num = Number(val);
      if (!isNaN(num) && num >= minR && num <= maxR) {
        scoreCounts[num] = (scoreCounts[num] || 0) + 1;
        scoreSum += num;
        totalAnswers++;
      }
    }

    const ratings: RatingDistribution[] = [];
    for (let r = minR; r <= maxR; r++) {
      const c = scoreCounts[r] || 0;
      ratings.push({
        score: r,
        count: c,
        percentage: totalAnswers > 0 ? Math.round((c / totalAnswers) * 100) : 0,
      });
    }

    const averageRating =
      totalAnswers > 0 ? Number((scoreSum / totalAnswers).toFixed(1)) : 0;

    return {
      fieldId: field.id,
      fieldLabel: field.label,
      fieldType: field.type,
      totalAnswers,
      completionRate:
        totalResponsesCount > 0
          ? Number(((totalAnswers / totalResponsesCount) * 100).toFixed(1))
          : 0,
      ratings,
      averageRating,
    };
  }

  // 4. Text, Textarea, Email, URL, Phone, Date, Time, File
  const recentTextAnswers: string[] = [];

  for (const resp of responses) {
    const val = resp.answers?.[field.id];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      totalAnswers++;
      if (recentTextAnswers.length < 6) {
        const textSnippet = String(val).trim();
        if (textSnippet && !recentTextAnswers.includes(textSnippet)) {
          recentTextAnswers.push(textSnippet);
        }
      }
    }
  }

  return {
    fieldId: field.id,
    fieldLabel: field.label,
    fieldType: field.type,
    totalAnswers,
    completionRate:
      totalResponsesCount > 0
        ? Number(((totalAnswers / totalResponsesCount) * 100).toFixed(1))
        : 0,
    recentTextAnswers,
  };
}

/**
 * Generates and triggers browser download of an authentic, UTF-8 encoded CSV file
 * containing all responses mapped dynamically against the form fields.
 */
export function exportFormResponsesToCsv(
  form: CustomForm,
  responses: CustomFormResponse[]
): { success: boolean; filename?: string; error?: string } {
  try {
    if (!form || !responses) {
      return { success: false, error: 'Form or response data is missing.' };
    }

    // 1. Build Header Row Dynamically
    const headers: string[] = [
      'Submission ID',
      'Submitted At (UTC)',
      'Submitted Date',
      'Respondent Email',
      'Respondent Type',
      ...(form.fields || []).map((f) => f.label || f.id),
    ];

    // 2. Build Data Rows
    const dataRows: string[][] = responses.map((resp, index) => {
      const submissionDate = resp.submittedAt || resp.createdAt;
      let formattedDateStr = '—';
      try {
        formattedDateStr = new Date(submissionDate).toLocaleString('en-GB', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
      } catch {
        formattedDateStr = submissionDate;
      }

      const respondentType = resp.userId
        ? 'ATC Student'
        : resp.respondentEmail
        ? 'Identified Visitor'
        : 'Anonymous';

      const fieldAnswers: string[] = (form.fields || []).map((field) => {
        const val = resp.answers?.[field.id];
        if (val === undefined || val === null) {
          return '';
        }
        if (Array.isArray(val)) {
          return val.join(', ');
        }
        return String(val);
      });

      return [
        String(index + 1).padStart(3, '0'),
        submissionDate,
        formattedDateStr,
        resp.respondentEmail || 'Anonymous',
        respondentType,
        ...fieldAnswers,
      ];
    });

    // 3. Serialize CSV with PapaParse
    const csvContent = Papa.unparse({
      fields: headers,
      data: dataRows,
    });

    // 4. Prepend UTF-8 BOM (\uFEFF) for Excel & Unicode/Indian language compatibility
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    // 5. Generate Safe Filename
    const cleanSlug = (form.slug || form.title || 'form')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const filename = `atc-form-${cleanSlug}-responses.csv`;

    // 6. Trigger Browser Download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (err: any) {
    console.error('[exportFormResponsesToCsv] CSV Export error:', err);
    return {
      success: false,
      error: err?.message || 'An error occurred while generating the CSV file.',
    };
  }
}

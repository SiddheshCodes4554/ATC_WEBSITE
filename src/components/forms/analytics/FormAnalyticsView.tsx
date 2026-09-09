import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  Star,
  Users,
  CheckCircle2,
  ListFilter,
  Layers,
  Sparkles,
  TrendingUp,
  Inbox,
  Tag,
  MessageSquare,
} from 'lucide-react';
import {
  CustomForm,
  CustomFormResponse,
  TimeRangeOption,
  FormFieldDefinition,
} from '../../../types/customForm.types';
import {
  filterResponsesByTimeRange,
  calculateAnalyticsSummary,
  calculateResponseTrend,
  calculateFieldAnalytics,
} from '../../../utils/formAnalytics';
import { ScrewHead } from '../../visual';

interface FormAnalyticsViewProps {
  form: CustomForm;
  responses: CustomFormResponse[];
}

export const FormAnalyticsView: React.FC<FormAnalyticsViewProps> = ({ form, responses }) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('all');

  // Filtered responses according to time range
  const filteredResponses = useMemo(() => {
    return filterResponsesByTimeRange(responses, timeRange);
  }, [responses, timeRange]);

  // Overall analytics summary
  const summary = useMemo(() => {
    return calculateAnalyticsSummary(filteredResponses, form);
  }, [filteredResponses, form]);

  // Response volume trend data
  const trendData = useMemo(() => {
    return calculateResponseTrend(filteredResponses, timeRange);
  }, [filteredResponses, timeRange]);

  // Maximum count in trend for scaling bars
  const maxTrendCount = useMemo(() => {
    return Math.max(1, ...trendData.map((d) => d.count));
  }, [trendData]);

  // Field analytics calculations
  const fieldAnalyticsList = useMemo(() => {
    return (form.fields || []).map((field) =>
      calculateFieldAnalytics(field, filteredResponses)
    );
  }, [form.fields, filteredResponses]);

  // Has rating field in form
  const hasRatingField = useMemo(() => {
    return (form.fields || []).some((f) => f.type === 'rating');
  }, [form.fields]);

  // Zero responses empty state
  if (responses.length === 0) {
    return (
      <div className="p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-5 select-none">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-[#121316]" />
        </div>
        <div className="space-y-1">
          <span className="px-3 py-0.5 rounded-full bg-[#FFF9DB] text-amber-900 border border-[#121316] font-mono text-[11px] font-black uppercase">
            NO ANALYTICS AVAILABLE
          </span>
          <h2 className="text-2xl font-black text-[#121316]">Zero Submissions Recorded</h2>
          <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-md mx-auto">
            Live analytics, trends, rating distributions, and answer frequency charts will populate automatically once respondents submit this form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Time Range Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-[#6C5CE7]" />
          <span className="font-mono text-xs font-black uppercase text-[#121316]">
            ANALYTICS TIME WINDOW:
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-2xl border-2 border-[#121316] w-full sm:w-auto overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All Time' },
              { id: '30d', label: 'Past 30 Days' },
              { id: '7d', label: 'Past 7 Days' },
              { id: 'today', label: 'Today' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeRange(t.id)}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all whitespace-nowrap cursor-pointer flex-1 sm:flex-initial text-center ${
                timeRange === t.id
                  ? 'bg-[#121316] text-white shadow-pop-xs'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total In Range */}
        <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-1">
          <span className="font-mono text-[11px] font-black uppercase text-gray-500 block">
            RESPONSES IN RANGE
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#121316]">
            {summary.totalResponses}
          </div>
          <span className="font-mono text-[10px] font-bold text-gray-400 block pt-1">
            of {responses.length} total all-time
          </span>
        </div>

        {/* Today Count */}
        <div className="p-5 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop space-y-1">
          <span className="font-mono text-[11px] font-black uppercase text-emerald-800 block">
            TODAY'S SUBMISSIONS
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-950">
            {summary.todayCount}
          </div>
          <span className="font-mono text-[10px] font-bold text-emerald-700 block pt-1">
            Recorded since 00:00
          </span>
        </div>

        {/* Past 7 Days Count */}
        <div className="p-5 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop space-y-1">
          <span className="font-mono text-[11px] font-black uppercase text-amber-800 block">
            THIS PAST WEEK
          </span>
          <div className="text-3xl sm:text-4xl font-black text-amber-950">
            {summary.weekCount}
          </div>
          <span className="font-mono text-[10px] font-bold text-amber-700 block pt-1">
            Rolling 7-day volume
          </span>
        </div>

        {/* Average Rating or Identified Respondent Ratio */}
        {hasRatingField && summary.averageRating !== undefined ? (
          <div className="p-5 rounded-3xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-[#6C5CE7] block">
              AVG RATING SCORE
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#6C5CE7] flex items-center gap-1.5">
              <span>★</span>
              <span>{summary.averageRating}</span>
            </div>
            <span className="font-mono text-[10px] font-bold text-purple-700 block pt-1">
              Across {summary.totalRatingResponses} rating answers
            </span>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-[#6C5CE7] block">
              IDENTIFIED RATIO
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#6C5CE7]">
              {summary.totalResponses > 0
                ? `${Math.round((summary.identifiedCount / summary.totalResponses) * 100)}%`
                : '0%'}
            </div>
            <span className="font-mono text-[10px] font-bold text-purple-700 block pt-1">
              {summary.identifiedCount} identified · {summary.anonymousCount} anon
            </span>
          </div>
        )}
      </div>

      {/* Submissions Over Time Trend Chart */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-6 relative">
        <ScrewHead className="absolute top-4 left-4 w-3.5 h-3.5" rotation={45} />
        <ScrewHead className="absolute top-4 right-4 w-3.5 h-3.5" rotation={135} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFE600] text-[#121316] border border-[#121316] font-mono text-[10px] font-black uppercase">
              <TrendingUp className="w-3 h-3" />
              <span>SUBMISSION VELOCITY</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#121316]">
              Submissions Over Time
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-gray-500">
            Peak Day: {maxTrendCount} {maxTrendCount === 1 ? 'response' : 'responses'}
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 overflow-x-auto pb-2 scrollbar-none">
          <div className="min-w-[500px] h-52 flex items-end justify-between gap-2.5 sm:gap-4 px-2 border-b-3 border-[#121316]">
            {trendData.map((pt, idx) => {
              const heightPercent = maxTrendCount > 0 ? (pt.count / maxTrendCount) * 100 : 0;
              const isPeak = pt.count === maxTrendCount && pt.count > 0;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 bg-[#121316] text-white text-[10px] font-mono font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-pop-xs">
                    {pt.count} submissions on {pt.label}
                  </div>

                  {/* Count Label on Top of Bar */}
                  {pt.count > 0 && (
                    <span className="font-mono text-[11px] font-black text-[#121316] mb-1">
                      {pt.count}
                    </span>
                  )}

                  {/* Vertical Bar */}
                  <div
                    style={{ height: `${Math.max(6, heightPercent)}%` }}
                    className={`w-full rounded-t-xl border-2 border-[#121316] transition-all duration-300 ${
                      isPeak
                        ? 'bg-[#FFE600] shadow-pop-xs'
                        : pt.count > 0
                        ? 'bg-[#E1DCFF] group-hover:bg-[#6C5CE7] group-hover:text-white'
                        : 'bg-gray-100 border-dashed border-gray-300'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Date Labels Beneath Bar Chart */}
          <div className="min-w-[500px] flex items-center justify-between gap-2.5 sm:gap-4 px-2 pt-2">
            {trendData.map((pt, idx) => (
              <div
                key={idx}
                className="flex-1 text-center font-mono text-[10px] font-bold text-gray-500 truncate"
                title={pt.label}
              >
                {pt.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question-by-Question Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#6C5CE7]" />
          <h3 className="font-mono text-sm font-black uppercase text-[#121316]">
            QUESTION BREAKDOWN & DISTRIBUTION
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fieldAnalyticsList.map((fieldData, fIdx) => (
            <div
              key={fieldData.fieldId}
              className="p-6 rounded-[32px] bg-white border-3 border-[#121316] shadow-pop flex flex-col justify-between space-y-4 relative"
            >
              {/* Question Header */}
              <div className="space-y-1 border-b-2 border-gray-100 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-gray-400">
                    Q{fIdx + 1} • {fieldData.fieldType.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black text-[#121316]">
                    {fieldData.totalAnswers} answered ({fieldData.completionRate}%)
                  </span>
                </div>
                <h4 className="font-black text-base sm:text-lg text-[#121316] tracking-tight">
                  {fieldData.fieldLabel}
                </h4>
              </div>

              {/* 1. Choice Distribution (Radio, Select, Checkbox) */}
              {fieldData.choices && fieldData.choices.length > 0 && (
                <div className="space-y-3 pt-1">
                  {fieldData.choices.map((choice, cIdx) => (
                    <div key={cIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-[#121316]">
                        <span className="truncate max-w-[70%]">{choice.option}</span>
                        <span className="font-mono font-black">
                          {choice.count} ({choice.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#FAF7F0] border border-[#121316] overflow-hidden">
                        <div
                          style={{ width: `${choice.percentage}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            cIdx === 0 ? 'bg-[#FFE600]' : 'bg-[#6C5CE7]'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Rating Distribution */}
              {fieldData.ratings && fieldData.ratings.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between bg-[#FFF9DB] p-3 rounded-2xl border-2 border-[#121316]">
                    <span className="font-mono text-xs font-black uppercase text-amber-900">
                      Average Score
                    </span>
                    <div className="font-mono text-lg font-black text-[#121316] flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#121316]" />
                      <span>{fieldData.averageRating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {fieldData.ratings.map((rating) => (
                      <div key={rating.score} className="flex items-center gap-3 text-xs">
                        <span className="font-mono font-black w-6 text-right">
                          ★ {rating.score}
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-[#FAF7F0] border border-[#121316] overflow-hidden">
                          <div
                            style={{ width: `${rating.percentage}%` }}
                            className="h-full bg-[#FFE600] rounded-full transition-all duration-500"
                          />
                        </div>
                        <span className="font-mono font-bold text-gray-500 w-14 text-right">
                          {rating.count} ({rating.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Text Answers Preview */}
              {fieldData.recentTextAnswers && fieldData.recentTextAnswers.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500 block">
                    SAMPLE RESPONSES:
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {fieldData.recentTextAnswers.map((txt, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#121316] text-xs font-bold text-gray-800 leading-snug break-words"
                      >
                        "{txt}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty Question State */}
              {fieldData.totalAnswers === 0 && (
                <div className="py-6 text-center text-xs font-bold text-gray-400 italic">
                  No responses received for this question yet.
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FormAnalyticsView;

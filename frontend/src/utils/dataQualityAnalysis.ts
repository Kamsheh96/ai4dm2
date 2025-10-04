export interface QualityDimension {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  recommendations: string[];
}

export interface DataQualityResult {
  overallScore: number;
  totalRecords: number;
  totalColumns: number;
  fileName: string;
  dimensions: {
    completeness: QualityDimension;
    consistency: QualityDimension;
    validity: QualityDimension;
    accuracy: QualityDimension;
    uniqueness: QualityDimension;
  };
  summary: string;
}

const getStatusFromScore = (score: number): 'excellent' | 'good' | 'fair' | 'poor' => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
};

const parseCSVContent = (content: string): string[][] => {
  const lines = content.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
};

const analyzeCompleteness = (data: string[][]): QualityDimension => {
  if (data.length < 2) {
    return {
      name: 'Completeness',
      score: 0,
      status: 'poor',
      issues: ['No data rows found'],
      recommendations: ['Ensure the file contains data beyond headers']
    };
  }

  const headers = data[0]; if (!headers) return { name: "Completeness", score: 0, status: 'poor', issues: ['No headers found'], recommendations: ['Ensure file has headers'] };
  const rows = data.slice(1);
  let totalCells = 0;
  let filledCells = 0;
  const emptyColumns: string[] = [];

  if (headers) headers.forEach((header, colIndex) => {
    let columnEmpty = 0;
    rows.forEach(row => {
      totalCells++;
      const value = row[colIndex]?.trim() || '';
      if (value && value !== 'null' && value !== 'NA' && value !== 'N/A') {
        filledCells++;
      } else {
        columnEmpty++;
      }
    });

    if (columnEmpty > rows.length * 0.5) {
      emptyColumns.push(header);
    }
  });

  const completenessRate = (filledCells / totalCells) * 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (emptyColumns.length > 0) {
    issues.push(`${emptyColumns.length} column(s) have >50% missing values: ${emptyColumns.slice(0, 3).join(', ')}${emptyColumns.length > 3 ? '...' : ''}`);
    recommendations.push('Review data collection processes for these columns');
  }

  const missingRate = ((totalCells - filledCells) / totalCells) * 100;
  if (missingRate > 10) {
    issues.push(`${missingRate.toFixed(1)}% of cells are empty`);
    recommendations.push('Implement validation rules at data entry points');
  }

  if (completenessRate === 100) {
    recommendations.push('Excellent! All fields are populated');
  }

  return {
    name: 'Completeness',
    score: Math.round(completenessRate),
    status: getStatusFromScore(Math.round(completenessRate)),
    issues,
    recommendations: recommendations.length > 0 ? recommendations : ['Maintain current data collection standards']
  };
};

const analyzeConsistency = (data: string[][]): QualityDimension => {
  if (data.length < 2) {
    return {
      name: 'Consistency',
      score: 0,
      status: 'poor',
      issues: ['Insufficient data for analysis'],
      recommendations: ['Add more data rows']
    };
  }

  const headers = data[0]; if (!headers) return { name: "Completeness", score: 0, status: 'poor', issues: ['No headers found'], recommendations: ['Ensure file has headers'] };
  const rows = data.slice(1);
  const issues: string[] = [];
  const recommendations: string[] = [];
  let consistencyScore = 100;

  if (headers) headers.forEach((header, colIndex) => {
    const values = rows.map(row => row[colIndex]?.trim() || '').filter(v => v);
    if (values.length === 0) return;

    const types = new Set<string>();
    values.forEach(value => {
      if (!isNaN(Number(value))) types.add('number');
      else if (value.match(/^\d{4}-\d{2}-\d{2}/)) types.add('date');
      else if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)) types.add('email');
      else types.add('string');
    });

    if (types.size > 1) {
      consistencyScore -= 10;
      issues.push(`Column "${header}" has mixed data types`);
      recommendations.push(`Standardize data format for column "${header}"`);
    }

    const caseVariations = new Set(values.map(v => v.toLowerCase()));
    const actualVariations = new Set(values);
    if (actualVariations.size > caseVariations.size * 1.3) {
      consistencyScore -= 5;
      issues.push(`Column "${header}" has inconsistent casing`);
      recommendations.push(`Apply consistent casing rules for "${header}"`);
    }
  });

  consistencyScore = Math.max(0, consistencyScore);

  if (issues.length === 0) {
    recommendations.push('Data formats are consistent across all columns');
  }

  return {
    name: 'Consistency',
    score: consistencyScore,
    status: getStatusFromScore(consistencyScore),
    issues,
    recommendations
  };
};

const analyzeValidity = (data: string[][]): QualityDimension => {
  if (data.length < 2) {
    return {
      name: 'Validity',
      score: 0,
      status: 'poor',
      issues: ['No data to validate'],
      recommendations: ['Add data rows for validation']
    };
  }

  const headers = data[0]; if (!headers) return { name: "Completeness", score: 0, status: 'poor', issues: ['No headers found'], recommendations: ['Ensure file has headers'] };
  const rows = data.slice(1);
  const issues: string[] = [];
  const recommendations: string[] = [];
  let validityScore = 100;
  let totalValidations = 0;
  let passedValidations = 0;

  if (headers) headers.forEach((header, colIndex) => {
    const values = rows.map(row => row[colIndex]?.trim() || '').filter(v => v);
    const headerLower = header.toLowerCase();

    if (headerLower.includes('email')) {
      values.forEach(value => {
        totalValidations++;
        if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/)) {
          passedValidations++;
        }
      });
      const emailValidRate = (passedValidations / Math.max(totalValidations, 1)) * 100;
      if (emailValidRate < 100) {
        issues.push(`${header}: ${(100 - emailValidRate).toFixed(1)}% invalid email formats`);
        recommendations.push(`Validate email format at entry for "${header}"`);
      }
    }

    if (headerLower.includes('date')) {
      values.forEach(value => {
        totalValidations++;
        if (value.match(/^\d{4}-\d{2}-\d{2}/) || value.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
          passedValidations++;
        }
      });
    }

    if (headerLower.includes('phone')) {
      values.forEach(value => {
        totalValidations++;
        const cleaned = value.replace(/[\s\-\(\)]/g, '');
        if (cleaned.match(/^\+?\d{10,15}$/)) {
          passedValidations++;
        }
      });
      const phoneValidRate = (passedValidations / Math.max(totalValidations, 1)) * 100;
      if (phoneValidRate < 100) {
        issues.push(`${header}: Invalid phone number formats detected`);
        recommendations.push(`Standardize phone number format for "${header}"`);
      }
    }

    if (headerLower.includes('age') || headerLower.includes('quantity') || headerLower.includes('amount')) {
      values.forEach(value => {
        totalValidations++;
        const num = Number(value);
        if (!isNaN(num) && num >= 0) {
          passedValidations++;
        }
      });
    }
  });

  if (totalValidations > 0) {
    validityScore = Math.round((passedValidations / totalValidations) * 100);
  }

  if (issues.length === 0) {
    recommendations.push('All validated fields meet expected formats');
  }

  return {
    name: 'Validity',
    score: validityScore,
    status: getStatusFromScore(validityScore),
    issues,
    recommendations
  };
};

interface BusinessRuleViolation {
  column: string;
  value: number;
  issue: string;
}

const checkBusinessRules = (data: string[][], headers: string[]): BusinessRuleViolation[] => {
  const violations: BusinessRuleViolation[] = [];
  const rows = data.slice(1);

  headers.forEach((header, colIndex) => {
    const headerLower = header.toLowerCase();
    
    if (headerLower.includes('age')) {
      rows.forEach((row, rowIndex) => {
        const val = row[colIndex]?.trim() || '';
        const age = Number(val);
        if (!isNaN(age)) {
          if (age < 0) {
            violations.push({
              column: header,
              value: age,
              issue: `Row ${rowIndex + 2}: Age ${age} is negative (impossible)`
            });
          } else if (age < 16) {
            violations.push({
              column: header,
              value: age,
              issue: `Row ${rowIndex + 2}: Age ${age} is below minimum expected value (< 16)`
            });
          } else if (age > 100) {
            violations.push({
              column: header,
              value: age,
              issue: `Row ${rowIndex + 2}: Age ${age} exceeds biological limits (> 100)`
            });
          }
        }
      });
    }
    
    if (headerLower.includes('salary') || headerLower.includes('price') || 
        headerLower.includes('amount') || headerLower.includes('cost')) {
      const values = rows.map((row, rowIndex) => {
        const val = row[colIndex]?.trim().replace(/[$,]/g, '') || '';
        const num = Number(val);
        return !isNaN(num) ? { value: num, rowIndex } : null;
      }).filter((v): v is { value: number; rowIndex: number } => v !== null);

      if (values.length > 0) {
        values.forEach(({ value, rowIndex }) => {
          if (value < 0) {
            violations.push({
              column: header,
              value: value,
              issue: `Row ${rowIndex + 2}: ${header} ${value} is negative (invalid for financial data)`
            });
          }
        });

        const sortedValues = values.map(v => v.value).sort((a, b) => a - b);
        const medianVal1 = sortedValues[sortedValues.length / 2 - 1];
        const medianVal2 = sortedValues[sortedValues.length / 2];
        const medianSingle = sortedValues[Math.floor(sortedValues.length / 2)];
        const median = sortedValues.length % 2 === 0 && medianVal1 !== undefined && medianVal2 !== undefined
          ? (medianVal1 + medianVal2) / 2
          : medianSingle;

        if (median !== undefined) {
          values.forEach(({ value, rowIndex }) => {
            if (value > median * 3 && median > 0) {
              violations.push({
                column: header,
                value: value,
                issue: `Row ${rowIndex + 2}: ${header} $${value.toLocaleString()} is an extreme outlier (>3x median of $${median.toLocaleString()})`
              });
            }
          });
        }
      }
    }
    
    if (headerLower.includes('count') || headerLower.includes('quantity') || 
        headerLower.includes('number') || headerLower.includes('total')) {
      rows.forEach((row, rowIndex) => {
        const val = row[colIndex]?.trim() || '';
        const num = Number(val);
        if (!isNaN(num) && num < 0) {
          violations.push({
            column: header,
            value: num,
            issue: `Row ${rowIndex + 2}: ${header} ${num} is negative (should be positive)`
          });
        }
      });
    }
  });

  return violations;
};

const analyzeAccuracy = (data: string[][]): QualityDimension => {
  if (data.length < 2) {
    return {
      name: 'Accuracy',
      score: 0,
      status: 'poor',
      issues: ['Insufficient data for accuracy assessment'],
      recommendations: ['Accuracy requires reference data or business rules']
    };
  }

  const headers = data[0];
  const rows = data.slice(1);
  const issues: string[] = [];
  const recommendations: string[] = [];
  let accuracyScore = 95;

  if (headers) {
    const businessRuleViolations = checkBusinessRules(data, headers);
    
    if (businessRuleViolations.length > 0) {
      const violationsByColumn = new Map<string, BusinessRuleViolation[]>();
      businessRuleViolations.forEach(violation => {
        if (!violationsByColumn.has(violation.column)) {
          violationsByColumn.set(violation.column, []);
        }
        violationsByColumn.get(violation.column)?.push(violation);
      });

      const totalRows = rows.length;
      const violationRate = (businessRuleViolations.length / totalRows) * 100;
      accuracyScore -= Math.min(35, violationRate * 2);

      violationsByColumn.forEach((violations, column) => {
        violations.slice(0, 3).forEach(v => {
          issues.push(v.issue);
        });
        if (violations.length > 3) {
          issues.push(`... and ${violations.length - 3} more violations in ${column}`);
        }
        recommendations.push(`Review and correct invalid values in "${column}"`);
      });
    }
  }

  let outlierCount = 0;
  let totalNumericValues = 0;
  const outlierDetails: string[] = [];

  if (data[0]) data[0].forEach((header, colIndex) => {
    const values = rows.map((row, rowIndex) => {
      const val = row[colIndex]?.trim().replace(/[$,]/g, '') || '';
      const num = Number(val);
      return !isNaN(num) ? { value: num, rowIndex } : null;
    }).filter((v): v is { value: number; rowIndex: number } => v !== null);

    if (values.length > 3) {
      totalNumericValues += values.length;
      const nums = values.map(v => v.value);
      
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const stdDev = Math.sqrt(nums.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / nums.length);

      const sorted = [...nums].sort((a, b) => a - b);
      const q1Index = Math.floor(sorted.length * 0.25);
      const q3Index = Math.floor(sorted.length * 0.75);
      const q1 = sorted[q1Index] ?? 0;
      const q3 = sorted[q3Index] ?? 0;
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      values.forEach(({ value, rowIndex }) => {
        const zScore = stdDev > 0 ? Math.abs(value - mean) / stdDev : 0;
        const isZScoreOutlier = zScore > 3;
        const isIQROutlier = value < lowerBound || value > upperBound;

        if (isZScoreOutlier || isIQROutlier) {
          outlierCount++;
          if (outlierDetails.length < 5) {
            const method = isZScoreOutlier && isIQROutlier ? 'z-score & IQR' : 
                          isZScoreOutlier ? 'z-score' : 'IQR';
            outlierDetails.push(`Row ${rowIndex + 2}, ${header}: ${value} (${method} outlier)`);
          }
        }
      });
    }
  });

  if (outlierCount > 0 && totalNumericValues > 0) {
    const outlierRate = (outlierCount / totalNumericValues) * 100;
    if (outlierRate > 2) {
      accuracyScore -= Math.min(20, outlierRate * 1.5);
      issues.push(`${outlierCount} statistical outliers detected (${outlierRate.toFixed(1)}% of numeric data)`);
      outlierDetails.forEach(detail => issues.push(detail));
      recommendations.push('Review outliers for data entry errors or legitimate edge cases');
    }
  }

  accuracyScore = Math.max(0, Math.round(accuracyScore));

  if (issues.length === 0) {
    issues.push('No accuracy issues detected based on business rules and statistical analysis');
    recommendations.push('Continue monitoring data quality with established validation rules');
  } else {
    recommendations.push('Implement data validation at entry points to prevent invalid values');
    recommendations.push('Consider establishing automated business rule checks');
  }

  return {
    name: 'Accuracy',
    score: accuracyScore,
    status: getStatusFromScore(accuracyScore),
    issues,
    recommendations
  };
};

const analyzeUniqueness = (data: string[][]): QualityDimension => {
  if (data.length < 2) {
    return {
      name: 'Uniqueness',
      score: 0,
      status: 'poor',
      issues: ['No data to analyze'],
      recommendations: ['Add data rows']
    };
  }

  const headers = data[0]; if (!headers) return { name: "Completeness", score: 0, status: 'poor', issues: ['No headers found'], recommendations: ['Ensure file has headers'] };
  const rows = data.slice(1);
  const issues: string[] = [];
  const recommendations: string[] = [];
  let uniquenessScore = 100;

  const fullRowSet = new Set(rows.map(row => row.join('|')));
  const duplicateRows = rows.length - fullRowSet.size;

  if (duplicateRows > 0) {
    const dupRate = (duplicateRows / rows.length) * 100;
    uniquenessScore -= Math.min(30, dupRate);
    issues.push(`${duplicateRows} duplicate rows found (${dupRate.toFixed(1)}%)`);
    recommendations.push('Remove duplicate records to ensure data integrity');
  }

  if (headers) headers.forEach((header, colIndex) => {
    const headerLower = header.toLowerCase();
    if (headerLower.includes('id') || headerLower.includes('key') || headerLower.includes('email')) {
      const values = rows.map(row => row[colIndex]?.trim() || '').filter(v => v);
      const uniqueValues = new Set(values);
      const dupCount = values.length - uniqueValues.size;

      if (dupCount > 0) {
        const dupRate = (dupCount / values.length) * 100;
        uniquenessScore -= Math.min(20, dupRate);
        issues.push(`Column "${header}" has ${dupCount} duplicates (expected to be unique)`);
        recommendations.push(`Enforce uniqueness constraint on "${header}"`);
      }
    }
  });

  uniquenessScore = Math.max(0, Math.round(uniquenessScore));

  if (issues.length === 0) {
    recommendations.push('No duplicate records detected - excellent data integrity');
  }

  return {
    name: 'Uniqueness',
    score: uniquenessScore,
    status: getStatusFromScore(uniquenessScore),
    issues,
    recommendations
  };
};

export const analyzeDataQuality = async (file: File): Promise<DataQualityResult> => {
  const content = await file.text();
  const data = parseCSVContent(content);

  if (data.length === 0) {
    throw new Error('File is empty or could not be parsed');
  }

  const completeness = analyzeCompleteness(data);
  const consistency = analyzeConsistency(data);
  const validity = analyzeValidity(data);
  const accuracy = analyzeAccuracy(data);
  const uniqueness = analyzeUniqueness(data);

  const overallScore = Math.round(
    (completeness.score + consistency.score + validity.score + accuracy.score + uniqueness.score) / 5
  );

  const totalRecords = data.length - 1;
  const totalColumns = data[0]?.length || 0;

  let summary = '';
  if (overallScore >= 90) {
    summary = '✨ Excellent data quality! Your dataset meets high standards across all dimensions.';
  } else if (overallScore >= 75) {
    summary = '👍 Good data quality with minor issues that can be easily addressed.';
  } else if (overallScore >= 60) {
    summary = '⚠️ Fair data quality. Several issues need attention to improve reliability.';
  } else {
    summary = '🚨 Poor data quality. Significant issues detected that require immediate action.';
  }

  return {
    overallScore,
    totalRecords,
    totalColumns,
    fileName: file.name,
    dimensions: {
      completeness,
      consistency,
      validity,
      accuracy,
      uniqueness
    },
    summary
  };
};

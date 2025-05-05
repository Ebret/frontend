import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  getAllDamayanFunds, 
  fetchDamayanFundStatistics,
  fetchFundContributions,
  generateDamayanReport
} from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const DamayanReports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundStatistics, setFundStatistics] = useState(null);
  const [reportType, setReportType] = useState('contributions');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all active funds
        const fundsData = await getAllDamayanFunds({ status: 'ACTIVE' });
        setFunds(fundsData);
        
        if (fundsData.length > 0) {
          // Select the first fund by default
          setSelectedFund(fundsData[0]);
          
          // Load fund statistics
          const statsData = await fetchDamayanFundStatistics(fundsData[0].id);
          setFundStatistics(statsData);
        }
      } catch (error) {
        console.error('Error loading Damayan data:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleFundChange = async (fundId) => {
    const fund = funds.find(f => f.id === parseInt(fundId, 10));
    setSelectedFund(fund);
    
    setIsLoading(true);
    try {
      // Load fund statistics
      const statsData = await fetchDamayanFundStatistics(fund.id);
      setFundStatistics(statsData);
      
      // Reset report data
      setReportData(null);
    } catch (error) {
      console.error('Error loading fund data:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const generateReport = async () => {
    if (!selectedFund) {
      toast.error('Please select a fund');
      return;
    }
    
    setIsGenerating(true);
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        fundId: selectedFund.id,
        reportType
      };
      
      const data = await generateDamayanReport(params);
      setReportData(data);
      
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsGenerating(false);
    }
  };
  
  const exportToCsv = () => {
    if (!reportData) return;
    
    let csvContent = '';
    
    // Add headers
    if (reportType === 'contributions') {
      csvContent = 'Date,Member,Amount,Type\n';
      
      // Add data rows
      reportData.contributions.forEach(item => {
        const date = format(new Date(item.contributionDate), 'yyyy-MM-dd');
        const member = `${item.user.firstName} ${item.user.lastName}`;
        const amount = item.amount;
        const type = item.contributionType;
        
        csvContent += `${date},"${member}",${amount},${type}\n`;
      });
    } else if (reportType === 'disbursements') {
      csvContent = 'Date,Member,Amount,Reason\n';
      
      // Add data rows
      reportData.disbursements.forEach(item => {
        const date = format(new Date(item.disbursementDate), 'yyyy-MM-dd');
        const member = `${item.user.firstName} ${item.user.lastName}`;
        const amount = item.amount;
        const reason = item.reason.replace(/"/g, '""'); // Escape quotes
        
        csvContent += `${date},"${member}",${amount},"${reason}"\n`;
      });
    } else if (reportType === 'summary') {
      csvContent = 'Metric,Value\n';
      
      // Add summary data
      Object.entries(reportData.summary).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`;
      });
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `damayan_${reportType}_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Damayan Reports</h3>
        <p className="mt-1 text-sm text-gray-500">
          Generate and export reports for Damayan funds
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="fundId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Damayan Fund
            </label>
            <select
              id="fundId"
              name="fundId"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedFund?.id || ''}
              onChange={(e) => handleFundChange(e.target.value)}
            >
              {funds.map((fund) => (
                <option key={fund.id} value={fund.id}>
                  {fund.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="reportType"
              name="reportType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="contributions">Contributions</option>
              <option value="disbursements">Disbursements</option>
              <option value="summary">Summary</option>
            </select>
          </div>
          
          <div className="md:col-span-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
        
        {reportData && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                {reportType === 'contributions' ? 'Contributions Report' : 
                 reportType === 'disbursements' ? 'Disbursements Report' : 'Summary Report'}
              </h4>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={exportToCsv}
              >
                <svg className="mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
            
            {reportType === 'contributions' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.contributions.map((contribution) => (
                      <tr key={contribution.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(contribution.contributionDate), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {contribution.user.firstName} {contribution.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contribution.user.memberId || 'No Member ID'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₱{contribution.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {contribution.contributionType.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₱{reportData.totals.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {reportData.contributions.length} contributions
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            
            {reportType === 'disbursements' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.disbursements.map((disbursement) => (
                      <tr key={disbursement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(disbursement.disbursementDate), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {disbursement.user.firstName} {disbursement.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {disbursement.user.memberId || 'No Member ID'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₱{disbursement.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {disbursement.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₱{reportData.totals.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {reportData.disbursements.length} disbursements
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            
            {reportType === 'summary' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="text-lg font-medium text-gray-900 mb-4">Fund Activity</h5>
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Total Contributions</dt>
                      <dd className="text-sm font-medium text-gray-900">₱{reportData.summary.totalContributions.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Number of Contributions</dt>
                      <dd className="text-sm font-medium text-gray-900">{reportData.summary.contributionsCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Total Disbursements</dt>
                      <dd className="text-sm font-medium text-gray-900">₱{reportData.summary.totalDisbursements.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Number of Disbursements</dt>
                      <dd className="text-sm font-medium text-gray-900">{reportData.summary.disbursementsCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Net Change</dt>
                      <dd className={`text-sm font-medium ${
                        reportData.summary.netChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₱{reportData.summary.netChange.toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="text-lg font-medium text-gray-900 mb-4">Member Participation</h5>
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Unique Contributors</dt>
                      <dd className="text-sm font-medium text-gray-900">{reportData.summary.uniqueContributorsCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Assistance Recipients</dt>
                      <dd className="text-sm font-medium text-gray-900">{reportData.summary.assistanceRecipientsCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Average Contribution</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ₱{reportData.summary.averageContribution.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Average Disbursement</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ₱{reportData.summary.averageDisbursement.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DamayanReports;

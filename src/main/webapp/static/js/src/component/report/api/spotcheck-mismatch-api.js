angular.module('open.spotcheck').factory('SpotcheckMismatchApi', ['$resource', spotcheckMismatchApi]);

function spotcheckMismatchApi($resource) {

    const DATE_FORMAT = 'YYYY-MM-DD h:mm:ss a';
    var mismatchApi = $resource(adminApiPath + "/spotcheck/mismatches");

    function getMismatches(datasource, contentType, mismatchStatuses,fromDate, toDate, limit, offset) {
        var params = {
            datasource: datasource,
            contentType: contentType,
            mismatchStatuses: mismatchStatuses,
            limit: limit,
            offset: offset,
            toDate: toDate
        };
        // for resolve
        if(mismatchStatuses.indexOf("RESOLVED") != -1)
            params['fromDate'] = fromDate;
        return mismatchApi.get(params).$promise
            .then(parseMismatches);
    }
    // TODO: Sort mismatches?
    function parseMismatches(response) {
        var result = {
            pagination: {
                total: 0
            },
            mismatches: []
        };
        result.pagination.total = response.total;
        angular.forEach(response.result.items, function (mismatch) {
            if (mismatch.ignoreStatus === 'NOT_IGNORED') {
                result.mismatches.push(createMismatch(mismatch));
            }
        });
        return result;
    }

    function createMismatch(mismatch) {
        return {
            id: parseMismatchId(mismatch),
            status: parseStatus(mismatch),
            mismatchType: parseMismatchType(mismatch),
            observedDate: parseObservedDate(mismatch),
            reportDate:parseReportDate(mismatch),
            issue: parseIssues(mismatch),
            refType: parseRefType(mismatch),
            bill: parseBill(mismatch),
            source:parseRefType(mismatch),
            calNo: parseCalNo(mismatch),
            session:parseSession(mismatch),
            basePrintNo:parseBasePrintNo(mismatch),
            referenceData: parseReferenceData(mismatch),
            observedData: parseObserveredData(mismatch),
            diffLoading:false,

            // TODO: Add CalType to API response.
            agendaNo: parseAgendaNo(mismatch),
            committee: parseCommittee(mismatch)
        }
    }
    function parseSession(mismatch) {
        return mismatch.key.session;
    }
    function parseBasePrintNo(mismatch) {
        return mismatch.key.basePrintNo;
    }
    function parseMismatchId(mismatch) {
        return mismatch.mismatchId;
    }

    function parseReferenceData(mismatch) {
        return mismatch.referenceData;
    }

    function parseStatus(mismatch) {
        return mismatch.status;
    }
    function parseObserveredData(mismatch) {
        return mismatch.observedData;
    }

    function parseMismatchType(mismatch) {
        return mismatchMap[mismatch.mismatchType];
    }

    function parseObservedDate(mismatch) {
        return moment(mismatch.observedDateTime).format(DATE_FORMAT);
    }
    function parseReportDate(mismatch) {
        return moment(mismatch.reportDateTime).format(DATE_FORMAT);
    }

    function parseIssues(mismatch) {
        return mismatch.issueIds.items.join(', ')
    }

    function parseRefType(mismatch) {
        return mismatch.referenceType;
    }

    function parseBill(mismatch) {
        return mismatch.key.printNo || "";
    }

    function parseCalNo(mismatch) {
        return mismatch.key.calNo || "";
    }

    function parseAgendaNo(mismatch) {
        if (mismatch.key.agendaId == null) {
            return "";
        }
        return mismatch.key.agendaId.number+mismatch.key.addendum;
    }

    function parseCommittee(mismatch) {
        if (mismatch.key.committeeId == null) {
            return "";
        }
        return mismatch.key.committeeId.name;
    }

    return {
        getMismatches: getMismatches
    }
}

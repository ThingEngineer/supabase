import React from 'react'
import { LOGS_TAILWIND_CLASSES } from '../Logs.constants'
import LogsDivider from '../Logs.Divider'
import {
  jsonSyntaxHighlight,
  ResponseCodeFormatter,
  SelectionDetailedRow,
  SelectionDetailedTimestampRow,
} from '../LogsFormatters'

const DatabaseApiSelectionRender = ({ log }: any) => {
  const request = log?.metadata[0]?.request?.[0]
  const response = log?.metadata[0]?.response?.[0]
  const method = request?.method
  const status = response?.status_code
  const ipAddress = request?.headers?.[0]?.cf_connecting_ip
  const countryOrigin = request?.headers?.[0]?.cf_ipcountry
  const clientInfo = request?.headers?.[0]?.x_client_info
  const referer = request?.headers?.[0]?.referer
  const redirectIdentifier = log?.metadata[0]?.load_balancer_redirect_identifier

  return (
    <>
      <div className={`${LOGS_TAILWIND_CLASSES.log_selection_x_padding} space-y-2`}>
        <SelectionDetailedRow
          label="Status"
          value={status}
          valueRender={<ResponseCodeFormatter value={status} />}
        />
        <SelectionDetailedRow label="Method" value={method} />
        <SelectionDetailedTimestampRow value={log.timestamp} />
        <SelectionDetailedRow label="IP Address" value={ipAddress} />
        <SelectionDetailedRow label="Origin Country" value={countryOrigin} />
        {clientInfo && <SelectionDetailedRow label="Client" value={clientInfo} />}
        {referer && <SelectionDetailedRow label="Referer" value={referer} />}
        {redirectIdentifier && (
          <SelectionDetailedRow label="Redirect Identifier" value={redirectIdentifier} />
        )}
      </div>
      <LogsDivider />
      <div className={`${LOGS_TAILWIND_CLASSES.log_selection_x_padding}`}>
        <h3 className="text-foreground-light mb-4 font-mono text-sm uppercase">Request Metadata</h3>
        <pre className="text-sm syntax-highlight overflow-x-auto mb-4">
          <div
            className="text-wrap"
            dangerouslySetInnerHTML={{
              __html: request ? jsonSyntaxHighlight(log.metadata[0].request[0]) : '',
            }}
          />
        </pre>
      </div>
      <LogsDivider />
      <div className={`${LOGS_TAILWIND_CLASSES.log_selection_x_padding}`}>
        <h3 className="text-foreground-light mb-4 font-mono text-sm uppercase">
          Response Metadata
        </h3>
        <pre className="text-sm syntax-highlight overflow-x-auto mb-4">
          <div
            dangerouslySetInnerHTML={{
              __html: response ? jsonSyntaxHighlight(log.metadata[0].response[0]) : '',
            }}
          />
        </pre>
      </div>
    </>
  )
}

export default DatabaseApiSelectionRender

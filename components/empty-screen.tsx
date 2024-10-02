import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Melbourne CBD apartment oversupply 2024',
    message: 'Analyse the current state of apartment oversupply in Melbourne CBD as of 2024, including vacancy rates, rental price trends, and impact on property values.'
  },
  {
    heading: 'Top 5 suburbs for Melbourne apartment ROI',
    message: 'Which 5 Melbourne suburbs offer the best return on investment for apartments in 2024? Consider factors such as capital growth, rental yield, and future development plans.'
  },
  {
    heading: 'Melbourne 2022 apartment regulations impact',
    message: 'How have the 2022 Better Apartments Design Standards affected new apartment developments in Melbourne? Analyse the impact on building designs, costs, and market supply.'
  },
  {
    heading: 'Docklands vs Southbank apartment market 2024',
    message: 'Provide a comprehensive comparison of the Docklands and Southbank apartment markets in 2024, including median prices, rental yields, demographic trends, and future growth prospects.'
  },
  {
    heading: 'Melbourne apartment yield trends 5-year forecast',
    message: 'What are the projected rental yield trends for Melbourne apartments over the next 5 years? Break down by apartment size and suburb tiers.'
  },
  {
    heading: 'Eureka Tower property value analysis',
    message: 'Conduct an in-depth analysis of property values in Eureka Tower, Southbank. Include historical price trends, current market position, and future value projections. Compare with similar luxury apartment buildings in Melbourne.'
  },
  {
    heading: 'Research and write a comprehensive report on 433 Collins St, Melbourne',
    message: 'Research and write a comprehensive report on 433 Collins St, Melbourne'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

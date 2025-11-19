import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          View detailed analytics and reports
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-xl mb-2">Analytics Dashboard</h3>
          <p className="text-muted-foreground mb-6">
            Advanced analytics and reporting features coming soon
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 border rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium">Sales Analytics</p>
              <p className="text-sm text-muted-foreground">Revenue trends & forecasts</p>
            </div>
            <div className="p-4 border rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium">Product Performance</p>
              <p className="text-sm text-muted-foreground">Top selling products</p>
            </div>
            <div className="p-4 border rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="font-medium">Customer Insights</p>
              <p className="text-sm text-muted-foreground">Behavior & demographics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

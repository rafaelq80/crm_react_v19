import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type Oportunidade from '../../../models/Oportunidade'
import { formatarMoeda } from '../../../utils/FormatarMoeda'
import { agruparOportunidadesPorProduto, agruparOportunidadesPorStatus, agruparVendasPorUsuario } from './DashboardData'

interface DashboardProps {
  oportunidades: Oportunidade[]
}

const CORES_PIZZA: Record<string, string> = {
  Aberta: '#f59e0b',
  Fechada: '#10b981',
  Perdida: '#ef4444',
}
const CORES_BARRAS = ['#0891b2', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308', '#f59e0b', '#ef4444']

function Dashboard({ oportunidades }: DashboardProps) {
  const oportunidadesPorStatus = agruparOportunidadesPorStatus(oportunidades)
  const oportunidadesPorProduto = agruparOportunidadesPorProduto(oportunidades)
  const vendasPorUsuario = agruparVendasPorUsuario(oportunidades)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl my-4">Dashboard</h1>
        <p className="text-gray-500">Visualize os dados de suas oportunidades</p>
      </div>

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gráfico 1: Oportunidades por Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Oportunidades por Status</h2>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={oportunidadesPorStatus as any}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {oportunidadesPorStatus.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_PIZZA[item.name] ?? '#0891b2'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} oportunidade(s)`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Vendas por Usuário */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ranking de Vendas por Usuário</h2>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={vendasPorUsuario} 
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  tickFormatter={(value) => {
                    const formatted = formatarMoeda(value)
                    return formatted.replace('R$', '').trim()
                  }}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={150}
                />
                <Tooltip 
                  formatter={(value: any) => [formatarMoeda(Number(value)), 'Total']} 
                  cursor={{ fill: 'rgba(8, 145, 178, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 8, 8, 0]}
                  maxBarSize={40}
                >
                  {vendasPorUsuario.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_BARRAS[index % CORES_BARRAS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Faturamento por Produto */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Faturamento por Produto</h2>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={oportunidadesPorProduto} 
                margin={{ top: 30, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  tickFormatter={(value) => {
                    const formatted = formatarMoeda(value)
                    return formatted.replace('R$', '').trim()
                  }}
                  tick={{ fontSize: 11 }}
                  width={70}
                />
                <Tooltip 
                  formatter={(value: any) => formatarMoeda(Number(value))} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  labelFormatter={(label) => `Produto: ${label}`}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                  {oportunidadesPorProduto.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_BARRAS[index % CORES_BARRAS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
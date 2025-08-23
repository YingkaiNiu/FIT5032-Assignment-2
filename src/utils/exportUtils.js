import jsPDF from 'jspdf'
import 'jspdf-autotable'

/**
 * 导出数据为CSV格式
 * @param {Array} data - 要导出的数据数组
 * @param {Array} headers - 表头数组
 * @param {string} filename - 文件名
 */
export const exportToCSV = (data, headers, filename = 'export.csv') => {
  try {
    // 创建CSV内容
    const csvContent = [
      // 表头行
      headers.map(header => `"${header}"`).join(','),
      // 数据行
      ...data.map(row => 
        Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n')

    // 创建Blob对象
    const blob = new Blob(['\ufeff' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    })

    // 创建下载链接
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true, message: 'CSV文件导出成功' }
  } catch (error) {
    console.error('CSV导出错误:', error)
    return { success: false, message: 'CSV导出失败: ' + error.message }
  }
}

/**
 * 导出数据为PDF格式
 * @param {Array} data - 要导出的数据数组
 * @param {Array} headers - 表头数组
 * @param {string} title - 文档标题
 * @param {string} filename - 文件名
 */
export const exportToPDF = (data, headers, title = '数据导出', filename = 'export.pdf') => {
  try {
    // 创建PDF文档
    const doc = new jsPDF()
    
    // 设置文档标题
    doc.setFontSize(18)
    doc.text(title, 14, 22)
    
    // 设置当前时间
    doc.setFontSize(10)
    const currentDate = new Date().toLocaleString('zh-CN')
    doc.text(`导出时间: ${currentDate}`, 14, 32)
    
    // 准备表格数据
    const tableData = data.map(row => Object.values(row))
    
    // 生成表格
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 40 }
    })

    // 保存PDF文件
    doc.save(filename)
    
    return { success: true, message: 'PDF文件导出成功' }
  } catch (error) {
    console.error('PDF导出错误:', error)
    return { success: false, message: 'PDF导出失败: ' + error.message }
  }
}

/**
 * 导出用户数据
 * @param {Array} users - 用户数据数组
 * @param {string} format - 导出格式 ('csv' 或 'pdf')
 */
export const exportUserData = (users, format = 'csv') => {
  const headers = ['ID', '姓名', '邮箱', '角色', '状态', '创建时间']
  
  // 格式化数据
  const formattedData = users.map(user => ({
    ID: user.id,
    姓名: user.name,
    邮箱: user.email,
    角色: user.role,
    状态: user.status,
    创建时间: new Date(user.createdAt).toLocaleDateString('zh-CN')
  }))

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  
  if (format === 'csv') {
    return exportToCSV(formattedData, headers, `用户数据_${timestamp}.csv`)
  } else if (format === 'pdf') {
    return exportToPDF(formattedData, headers, '用户管理数据', `用户数据_${timestamp}.pdf`)
  }
}

/**
 * 导出服务数据
 * @param {Array} services - 服务数据数组
 * @param {string} format - 导出格式 ('csv' 或 'pdf')
 */
export const exportServiceData = (services, format = 'csv') => {
  const headers = ['ID', '服务名称', '类别', '客户名称', '状态', '优先级', '持续时间', '日期']
  
  // 格式化数据
  const formattedData = services.map(service => ({
    ID: service.id,
    服务名称: service.serviceName,
    类别: service.category,
    客户名称: service.clientName,
    状态: service.status,
    优先级: service.priority,
    持续时间: `${service.duration}小时`,
    日期: new Date(service.date).toLocaleDateString('zh-CN')
  }))

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  
  if (format === 'csv') {
    return exportToCSV(formattedData, headers, `服务数据_${timestamp}.csv`)
  } else if (format === 'pdf') {
    return exportToPDF(formattedData, headers, '服务管理数据', `服务数据_${timestamp}.pdf`)
  }
}

/**
 * 导出健康服务数据
 * @param {Array} healthServices - 健康服务数据数组
 * @param {string} format - 导出格式 ('csv' 或 'pdf')
 */
export const exportHealthServiceData = (healthServices, format = 'csv') => {
  const headers = ['ID', '服务名称', '类别', '地址', '距离', '电话', '评分']
  
  // 格式化数据
  const formattedData = healthServices.map(service => ({
    ID: service.id,
    服务名称: service.name,
    类别: service.category,
    地址: service.address,
    距离: `${service.distance}km`,
    电话: service.phone,
    评分: `${service.rating}/5`
  }))

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  
  if (format === 'csv') {
    return exportToCSV(formattedData, headers, `健康服务数据_${timestamp}.csv`)
  } else if (format === 'pdf') {
    return exportToPDF(formattedData, headers, '健康服务数据', `健康服务数据_${timestamp}.pdf`)
  }
}

/**
 * 导出邮件记录数据
 * @param {Array} emailRecords - 邮件记录数组
 * @param {string} format - 导出格式 ('csv' 或 'pdf')
 */
export const exportEmailData = (emailRecords, format = 'csv') => {
  const headers = ['发送时间', '收件人', '发件人', '主题', '状态', '附件']
  
  // 格式化数据
  const formattedData = emailRecords.map(record => ({
    发送时间: new Date(record.timestamp).toLocaleString('zh-CN'),
    收件人: record.toEmail,
    发件人: record.fromName,
    主题: record.subject,
    状态: record.status,
    附件: record.attachment ? '是' : '否'
  }))

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  
  if (format === 'csv') {
    return exportToCSV(formattedData, headers, `邮件记录_${timestamp}.csv`)
  } else if (format === 'pdf') {
    return exportToPDF(formattedData, headers, '邮件发送记录', `邮件记录_${timestamp}.pdf`)
  }
}

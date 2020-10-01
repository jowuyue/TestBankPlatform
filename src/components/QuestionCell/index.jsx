/* eslint-disable react/no-danger */
import React, { useState, useContext } from 'react'
import { StarOutlined, BookOutlined, BugFilled, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { changeQuestionStatus } from '@/services/audit';
import { deleteQuestion } from '@/services/myQuestion/create';
import styles from './index.less'
import { QuestionTypesDetail } from '../Enums'

const DetailUrl = {
  person: '/questionBank/personalQuestion/detail/',
  question: '/questionBank/manage/detail/'
}
const QuestionCellContext = React.createContext(DetailUrl.person)

const colors = {
  warn: '#F1AE35',
  fail: '#6C6C6C',
  success: '#3CC42F',
  disabled: '#CCCCCC'
}
const QuestionStatus = {
  0: {
    title: '未提交',
    color: colors.disabled
  },
  1: {
    title: '审核中',
    color: colors.warn
  },
  2: {
    title: '审核通过',
    color: colors.success
  },
  3: {
    title: '审核未通过',
    color: colors.disabled
  },
  4: {
    title: '下架',
    color: colors.disabled
  },
  10: {
    title: '不是错题',
    color: colors.disabled
  },
  11: {
    title: '错题',
    color: colors.fail
  },
}
const statusRender = (status, reason) => {
  // eslint-disable-next-line default-case
  const statuData = QuestionStatus[status]
  const style = {
    color: statuData.color
  }
  if (status === 3) {
    style.display = 'inline-block'
    style['white-space'] = 'nowrap'
    return <span style={style}>
      <div >{statuData.title}</div>
      {reason ? <BugFilled title={reason} style={{ color: 'red' }} /> : null}
    </span>
  }
  return <span style={style}>{statuData.title}</span>
}
const QuestionCell = (props) => {
  const { data = {}, isAudit, isWrong } = props
  const { question,
    difficultyLevel = 0,
    type,
    tags = [],
    remark,
    status,
    favorityCount,
    referenceCount } = data
  const onBtnClick = (t) => {
    let title = ''
    let onOk
    if (t === 'del') {
      title = '删除后将不能找回，确认删除？'
      onOk = () => {
        return new Promise((resolve) => {
          deleteQuestion({
            id: data.id
          }).then(resolve)
        })
      }
    }
    if (t === 'sub') {
      title = '提交新题审核？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 1,
            id: data.id
          }).then(resolve)
        })
      }
    }
    if (t === 'rev') {
      title = '撤回新题审核？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 1,
            id: data.id
          }).then(resolve)
        })
      }
    }
    Modal.confirm({
      title: '注意',
      icon: <ExclamationCircleOutlined />,
      content: title,
      okText: '确认',
      cancelText: '取消',
      onOk
    })
  }
  const menuRender = () => {
    const edit = <Button key="edit" type='link'>
      <Link to={`/questionBank/personalQuestion/edit/${data.id}`}>编辑</Link>
    </Button>
    const sub = <Button key="sub" type='link' onClick={() => {
      onBtnClick('sub')
    }}>提交审核</Button>
    const rev = <Button key="rev" type='link' onClick={() => {
      onBtnClick('rev')
    }}>撤回审核</Button>
    const del = <Button key="del" type='link' style={{ color: 'red' }} onClick={() => {
      onBtnClick('del')
    }}>删除</Button>
    let btnList = []
    switch (status) {
      case 0:
      case 3:
        btnList = [edit, sub, del]
        break;
      case 1:
        btnList = [rev]
        break;
      case 2:
        btnList = [edit, del]
        break;
      case 4:
        btnList = [del]
        break;
      default:
        break
    }
    return <Menu>
      {btnList.map(btn => {
        return <Menu.Item>
          {btn}
        </Menu.Item>
      })}
    </Menu>
  }
  const url = useContext(QuestionCellContext)
  const normalRender = () => {
    return <div className={styles.operate}>
      <div>
        <span><StarOutlined />{favorityCount || 0}</span>
        <span><BookOutlined />{referenceCount || 0}</span>
      </div>
      <div>
        <Link type="link" to={`${url}${data.id}`}>详情</Link>
        <Divider type="vertical" />
        <Dropdown overlay={menuRender()} placement="bottomCenter">
          <Button type="link">更多 <DownOutlined /></Button>
        </Dropdown>
      </div>
    </div>
  }
  const auditRender = () => {
    return <div className={styles.operate} >
      <Link type="link" to={{
        pathname: `${url}${data.id}`,
        state: { isAudit, isWrong }
      }}>查看</Link>
    </div>
  }
  return <div className={styles.cell}>
    <div className={styles.content}>
      <div className={styles.title}>
        <span >{type ? QuestionTypesDetail[type].title : null} * 难度 {difficultyLevel} </span>
      </div>

      <div className={styles.question} dangerouslySetInnerHTML={{ '__html': question || '' }} />
      <div className={styles.labels}>
        {tags && tags.map(tag => <span key={tag.id}>{tag.value}</span>)}
      </div>
    </div>
    <div className={styles.right}>
      <div>{statusRender(status, remark)}</div>
      {isAudit ? auditRender() : normalRender()}
    </div>
  </div>
}


export { QuestionCell, QuestionCellContext }
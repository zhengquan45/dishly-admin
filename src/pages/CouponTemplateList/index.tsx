import {
  addCouponTemplate,
  couponTemplate,
  product,
  updateCouponTemplate,
} from '@/services/ant-design-pro/api';
import { PlusCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { ProFormDateTimeRangePicker } from '@ant-design/pro-form';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CouponTemplateListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addCouponTemplate({
      name: fields.name,
      type: fields.type,
      discountRate: fields.discountRate,
      fullAmount: fields.fullAmount,
      reduceAmount: fields.reduceAmount,
      cashAmount: fields.cashAmount,
      redeemProductId: fields.redeemProductId,
      validityType: fields.validityType,
      validityDays: fields.validityDays,
      dateRange: fields.dateRange,
      minOrderAmount: fields.minOrderAmount,
      status: fields.status,
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateCouponTemplate({
      id: fields.id,
      name: fields.name,
      type: fields.type,
      discountRate: fields.discountRate,
      fullAmount: fields.fullAmount,
      reduceAmount: fields.reduceAmount,
      cashAmount: fields.cashAmount,
      validityType: fields.validityType,
      validityDays: fields.validityDays,
      dateRange: fields.dateRange,
      minOrderAmount: fields.minOrderAmount,
      status: fields.status,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const CouponTemplateList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CouponTemplateListItem>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.CouponTemplateListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.nameLabel"
          defaultMessage="Coupon template name"
        />
      ),
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.typeLabel"
          defaultMessage="Coupon Template"
        />
      ),
      dataIndex: 'type',
      valueType: 'text',
      hideInForm: true,
      valueEnum: {
        DISCOUNT: {
          text: '折扣券',
        },
        FULL_REDUCE: {
          text: '满减券',
        },
        CASH: {
          text: '现金券',
        },
        REDEEM: {
          text: '兑换券',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.discountRateLabel"
          defaultMessage="Discount rate"
        />
      ),
      dataIndex: 'discountRate',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.fullAmountLabel"
          defaultMessage="Full amount"
        />
      ),
      dataIndex: 'fullAmount',
      valueType: 'money',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.reduceAmountLabel"
          defaultMessage="Reduce amount"
        />
      ),
      dataIndex: 'reduceAmount',
      valueType: 'money',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.cashAmountLabel"
          defaultMessage="Cash amount"
        />
      ),
      dataIndex: 'cashAmount',
      valueType: 'money',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.redeemProductLabel"
          defaultMessage="Redeem product"
        />
      ),
      dataIndex: 'redeemProductId',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.contentLabel"
          defaultMessage=""
        />
      ),
      dataIndex: 'content',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, record) => {
        return `
          ${record.discountRate ? `折扣率：${record.discountRate}%` : ''} 
          ${
            record.fullAmount && record.reduceAmount
              ? `满${record.fullAmount}减${record.reduceAmount}`
              : ''
          }
          ${record.cashAmount ? `现金金额：${record.cashAmount}` : ''}
          ${record.redeemProductId ? `兑换商品：${record.redeemProductName}` : ''}
              `;
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.validityTypeLabel"
          defaultMessage="Validity period type"
        />
      ),
      dataIndex: 'validityType',
      valueType: 'text',
      hideInForm: true,
      valueEnum: {
        ABSOLUTE: {
          text: '绝对时间',
        },
        RELATIVE: {
          text: '相对时间',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.validityDaysLabel"
          defaultMessage="Validity days"
        />
      ),
      dataIndex: 'validityDays',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.dateRangeLabel"
          defaultMessage="Date Range"
        />
      ),
      dataIndex: 'dateRange',
      valueType: 'text',
      renderText: (dateRange) => {
        return `
              ${dayjs(dateRange[0]).format('YYYY-MM-DD HH:mm:ss')}
                ~
              ${dayjs(dateRange[1]).format('YYYY-MM-DD HH:mm:ss')}
              `;
      },
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.dateRangeLabel"
          defaultMessage="Date Range"
        />
      ),
      dataIndex: 'dateRange',
      valueType: 'text',
      renderText: (_, record) => {
        return `${
          record.validityType === 'ABSOLUTE' && record?.dateRange
            ? `${dayjs(record?.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')} ~ ${dayjs(
                record?.dateRange[1],
              ).format('YYYY-MM-DD HH:mm:ss')}`
            : `领取后 ${record.validityDays} 天内`
        }`;
      },
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.couponTemplate.searchTable.updateForm.minOrderAmountLabel"
          defaultMessage="Minimum order amount"
        />
      ),
      dataIndex: 'minOrderAmount',
      valueType: 'money',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            console.log('record', record);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.update" defaultMessage="Update" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.CouponTemplateListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.couponTemplate.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusCircleFilled />{' '}
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={couponTemplate}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.couponTemplate.searchTable.createForm.newCouponTemplate',
          defaultMessage: 'New coupon template',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.BannerListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
        initialValues={{
          type: 'DISCOUNT',
          validityType: 'ABSOLUTE',
          minOrderAmount: 0,
          totalQuantity: 999999,
          limitPerUser: 1,
          status: true,
        }}
      >
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.nameLabel',
            defaultMessage: 'coupon template name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.couponTemplate.searchTable.updateForm.nameRule"
                  defaultMessage="coupon template name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormSelect
          name="type"
          width="md"
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.typeLabel',
            defaultMessage: 'coupon template type',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.couponTemplate.searchTable.updateForm.typeRule"
                  defaultMessage="Please select coupon template type"
                />
              ),
            },
          ]}
          valueEnum={{
            DISCOUNT: {
              text: '折扣券',
            },
            FULL_REDUCE: {
              text: '满减券',
            },
            CASH: {
              text: '现金券',
            },
            REDEEM: {
              text: '兑换券',
            },
          }}
        />
        {/* 监听 type 字段，动态渲染配置项 */}
        <ProFormDependency name={['type']}>
          {({ type }) => {
            switch (type) {
              case 'DISCOUNT':
                return (
                  <ProFormDigit
                    name="discountRate"
                    label="折扣比例"
                    width="md"
                    min={1}
                    max={99}
                    fieldProps={{ addonAfter: '%' }}
                    rules={[{ required: true, message: '请输入折扣比例' }]}
                  />
                );
              case 'FULL_REDUCE':
                return (
                  <>
                    <ProFormDigit
                      name="fullAmount"
                      label="满减门槛"
                      width="md"
                      min={0}
                      fieldProps={{ prefix: '¥' }}
                      rules={[{ required: true, message: '请输入满减门槛金额' }]}
                    />
                    <ProFormDigit
                      name="reduceAmount"
                      label="优惠金额"
                      width="md"
                      min={1}
                      fieldProps={{ prefix: '¥' }}
                      rules={[{ required: true, message: '请输入优惠金额' }]}
                    />
                  </>
                );
              case 'CASH':
                return (
                  <ProFormDigit
                    name="cashAmount"
                    label="现金金额"
                    width="md"
                    min={1}
                    fieldProps={{ prefix: '¥' }}
                    rules={[{ required: true, message: '请输入现金金额' }]}
                  />
                );
              case 'REDEEM':
                return (
                  <ProFormSelect
                    name="redeemProductId"
                    label="兑换商品"
                    width="md"
                    rules={[{ required: true, message: '请选择兑换商品' }]}
                    showSearch
                    debounceTime={300}
                    request={async ({ keyWords }) => {
                      const data = await product({
                        name: keyWords,
                        pageSize: 10,
                        current: 1,
                      });
                      if (data.data) {
                        return data.data.map((item) => {
                          return {
                            label: item.name,
                            value: item.id,
                          };
                        });
                      }
                      return [];
                    }}
                  />
                );
              default:
                return null;
            }
          }}
        </ProFormDependency>
        <ProFormSelect
          name="validityType"
          width="md"
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.validityTypeLabel',
            defaultMessage: 'Validity period type',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.couponTemplate.searchTable.updateForm.validityTypeRule"
                  defaultMessage="Please select validity period type"
                />
              ),
            },
          ]}
          valueEnum={{
            ABSOLUTE: {
              text: '绝对时间',
            },
            RELATIVE: {
              text: '相对时间',
            },
          }}
        />
        {/* 监听 validityType 字段，动态渲染配置项 */}
        <ProFormDependency name={['validityType']}>
          {({ validityType }) => {
            switch (validityType) {
              case 'ABSOLUTE':
                return (
                  <ProFormDateTimeRangePicker
                    label={intl.formatMessage({
                      id: 'pages.couponTemplate.searchTable.updateForm.dateRangeLabel',
                      defaultMessage: 'Date Range',
                    })}
                    name="dateRange"
                    placeholder={[
                      intl.formatMessage({
                        id: 'pages.couponTemplate.searchTable.updateForm.startTimePlaceholder',
                        defaultMessage: 'Start Time',
                      }),
                      intl.formatMessage({
                        id: 'pages.couponTemplate.searchTable.updateForm.endTimePlaceholder',
                        defaultMessage: 'End Time',
                      }),
                    ]}
                    rules={[{ required: true, message: '请选择有效期时间' }]}
                  />
                );
              case 'RELATIVE':
                return (
                  <>
                    <ProFormDigit
                      name="validityDays"
                      label="有效天数"
                      width="md"
                      min={1}
                      rules={[{ required: true, message: '请输入有效天数' }]}
                    />
                  </>
                );
              default:
                return null;
            }
          }}
        </ProFormDependency>
        <ProFormDigit
          name="minOrderAmount"
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.minOrderAmountLabel',
            defaultMessage: 'Minimum order amount',
          })}
          width="md"
          fieldProps={{ prefix: '¥' }}
        />
        <ProFormSwitch
          name="status"
          width="md"
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.statusLabel',
            defaultMessage: 'couponTemplate status',
          })}
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.BannerListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.BannerListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CouponTemplateList;

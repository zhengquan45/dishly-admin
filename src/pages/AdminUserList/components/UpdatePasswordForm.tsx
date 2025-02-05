import { ProFormText } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-form/lib';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Col, Modal, Row, Space } from 'antd';
import React, { useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.AdminUserListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.AdminUserListItem>;
};

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [formLayoutType] = useState<LayoutType>(LAYOUT_TYPE_HORIZONTAL);

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

  return (
    <Modal
      width={640}
      // bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={intl.formatMessage({
        id: 'pages.searchTable.updatePassword',
        defaultMessage: '商品配置',
      })}
      open={props.updateModalOpen}
      onCancel={() => {
        props.onCancel();
      }}
      footer={null}
    >
      <ProForm
        initialValues={{
          id: props.values.id,
        }}
        {...formItemLayout}
        layout={formLayoutType}
        submitter={{
          render: (props, doms) => {
            return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
              <Row>
                <Col span={14} offset={4}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            ) : (
              doms
            );
          },
        }}
        onFinish={props.onSubmit}
      >
        <ProFormText name="id" hidden={true} />
        <ProFormText.Password
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.passwordLabel',
            defaultMessage: 'banner name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.passwordRule"
                  defaultMessage="Banner name is required"
                />
              ),
            },
          ]}
          width="md"
          name="password"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;

import { PlayIcon } from "@heroicons/react/outline";
import Button from "core/components/Button";
import Checkbox from "core/components/forms/Checkbox";
import Field from "core/components/forms/Field";
import useForm from "core/hooks/useForm";
import { useTranslation } from "next-i18next";

type Form = {
  start_date: string;
  end_date: string;
  generate_extract: boolean;
  update_dhis2: boolean;
  update_dashboard: boolean;
};

type IHPFormProps = {
  onSubmit(config: { [key: string]: any }): Promise<void>;
  fromConfig?: { parameters: Form } | null;
};

const IHPForm = (props: IHPFormProps) => {
  const { onSubmit, fromConfig } = props;
  const { t } = useTranslation();
  const form = useForm<Form>({
    validate(values) {
      const errors = {} as any;
      if (
        values.start_date &&
        values.end_date &&
        values.start_date >= values.end_date
      ) {
        errors.start_date = t(
          "Enter start and end date. Start date must be before end date."
        );
      }

      return errors;
    },
    getInitialState() {
      let initialState = {
        generate_extract: false,
        update_dhis2: false,
        update_dashboard: false,
      };
      if (fromConfig) {
        initialState = { ...initialState, ...fromConfig.parameters };
      }
      return initialState;
    },

    onSubmit(values) {
      onSubmit({ parameters: values });
    },
  });
  return (
    <form onSubmit={form.handleSubmit} className="grid grid-cols-2 gap-4">
      <Field
        name="start_date"
        type="date"
        required
        value={form.formData.start_date}
        onChange={form.handleInputChange}
        id="start_date"
        label={t("From date")}
        error={form.touched.start_date && form.errors.start_date}
      />
      <Field
        name="end_date"
        type="date"
        required
        value={form.formData.end_date}
        onChange={form.handleInputChange}
        id="end_date"
        label={t("To date")}
        error={form.touched.end_date && form.errors.end_date}
      />

      <Checkbox
        checked={form.formData.generate_extract}
        name="generate_extract"
        onChange={form.handleInputChange}
        label={t("Generate extract")}
      />
      <Checkbox
        checked={form.formData.update_dhis2}
        name="update_dhis2"
        onChange={form.handleInputChange}
        label={t("Update DHIS2")}
      />
      <Checkbox
        checked={form.formData.update_dashboard}
        name="update_dashboard"
        onChange={form.handleInputChange}
        label={t("Update dashboard")}
      />
      <div className="col-span-2 text-right">
        <Button
          disabled={!form.isValid}
          type="submit"
          leadingIcon={<PlayIcon className="w-6" />}
        >
          {t("Configure & run")}
        </Button>
      </div>
    </form>
  );
};

export default IHPForm;

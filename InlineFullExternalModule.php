<?php namespace RUB\InlineFullExternalModule;

require_once "classes/InjectionHelper.php";
require_once "classes/ActionTagParser.php";

/**
 * ExternalModule class for Fullscreen Inline.
 */
class InlineFullExternalModule extends \ExternalModules\AbstractExternalModule {


    const AT_INLINEFULL_SURVEY = "@INLINE-FULL-SURVEY";
    const AT_INLINEFULL_DATAENTRY = "@INLINE-FULL-DATAENTRY";

    #region Constructor and Instance Variables

    /**
     * @var InjectionHelper
     */
    public $ih = null;

    /**
     * EM Framework (tooling support)
     * @var \ExternalModules\Framework
     */
    private $fw;
 
    function __construct() {
        parent::__construct();
        $this->fw = $this->framework;
        $this->ih = InjectionHelper::init($this);
    }

    #endregion

    #region Hooks

    function redcap_data_entry_form($project_id, $record = NULL, $instrument, $event_id, $group_id = NULL, $repeat_instance = 1) {
        $settings = $this->get_settings($project_id, $instrument, self::AT_INLINEFULL_DATAENTRY);
        if (count($settings["targets"])) {
            $settings["isSurvey"] = false;
            $this->ih->js("js/inline-full-em.js", true);
            $this->ih->css("css/inline-full-em.css", true);
            print "<script>REDCap.EM.RUB.InlineFull.init(".json_encode($settings, JSON_UNESCAPED_UNICODE).");</script>";
        }
    }

    function redcap_survey_page($project_id, $record = NULL, $instrument, $event_id, $group_id = NULL, $survey_hash, $response_id = NULL, $repeat_instance = 1) {
        $settings = $this->get_settings($project_id, $instrument, self::AT_INLINEFULL_SURVEY);
        if (count($settings["targets"])) {
            $settings["isSurvey"] = true;
            $this->ih->js("js/inline-full-em.js", true);
            $this->ih->css("css/inline-full-em.css", true);
            print "<script>REDCap.EM.RUB.InlineFull.init(".json_encode($settings, JSON_UNESCAPED_UNICODE).");</script>";
        }
    }

    #endregion


    private function get_settings($pid, $form, $at_name) {
        $targets = [];
        $Proj = new \Project($pid);
        foreach ($Proj->forms[$form]["fields"] as $target => $_) {
            $has_at = false;
            $has_inline = false;
            $meta = $Proj->metadata[$target];
            $misc = $meta["misc"] ?? "";
            if (strpos($misc, $at_name) !== false) {
                $result = ActionTagParser::parse($misc);
                foreach ($result["parts"] as $at) {
                    $has_inline = $has_inline || $at["text"] == "@INLINE";
                    $has_at = $has_at || $at["text"] == $at_name;
                }
            }
            if ($has_at) {
                $targets[$target] = [ "inline" => $has_inline ];
            }
        }
        return array(
            "debug" => $this->getProjectSetting("debug") == true,
            "targets" => $targets,
        );
    }
}